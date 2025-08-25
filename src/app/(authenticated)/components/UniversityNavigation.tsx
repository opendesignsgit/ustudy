"use client";

import React, { useState, useEffect } from 'react';

interface UniversityPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  showInMenu: boolean;
  menuOrder: number;
  parent?: string | null;
  children?: UniversityPage[];
}

interface UniversityNavigationProps {
  universitySlug: string;
  currentPageSlug?: string;
  className?: string;
}

export const UniversityNavigation: React.FC<UniversityNavigationProps> = ({ 
  universitySlug, 
  currentPageSlug, 
  className = '' 
}) => {
  const [pages, setPages] = useState<UniversityPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, [universitySlug]);

  const fetchPages = async () => {
    try {
      // First get the university ID
      const universityRes = await fetch(`/api/universities?where[slug][equals]=${universitySlug}`);
      const universityData = await universityRes.json();
      
      if (!universityData.docs || universityData.docs.length === 0) {
        return;
      }

      const university = universityData.docs[0];

      // Fetch all published pages for this university that should show in menu
      const response = await fetch(
        `/api/university-pages?where[university][equals]=${university.id}&where[_status][equals]=published&where[showInMenu][equals]=true&sort=menuOrder`
      );

      if (response.ok) {
        const data = await response.json();
        const allPages = data.docs || [];
        
        // Build hierarchical structure
        const hierarchicalPages = buildHierarchy(allPages);
        setPages(hierarchicalPages);
      }
    } catch (error) {
      console.error('Error fetching university pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildHierarchy = (pages: UniversityPage[]): UniversityPage[] => {
    // Create a map for quick lookup
    const pageMap = new Map<string, UniversityPage>();
    const rootPages: UniversityPage[] = [];

    // Initialize all pages with empty children array
    pages.forEach(page => {
      pageMap.set(page.id, { ...page, children: [] });
    });

    // Build the hierarchy
    pages.forEach(page => {
      const pageWithChildren = pageMap.get(page.id)!;
      
      if (page.parent) {
        // This page has a parent, add it to parent's children
        const parent = pageMap.get(page.parent);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(pageWithChildren);
        }
      } else {
        // This is a root level page
        rootPages.push(pageWithChildren);
      }
    });

    // Sort children by menuOrder
    const sortByOrder = (pages: UniversityPage[]) => {
      pages.sort((a, b) => a.menuOrder - b.menuOrder);
      pages.forEach(page => {
        if (page.children && page.children.length > 0) {
          sortByOrder(page.children);
        }
      });
    };

    sortByOrder(rootPages);
    return rootPages;
  };

  const getPageUrl = (page: UniversityPage, parent?: UniversityPage): string => {
    if (parent) {
      return `/universities/${universitySlug}/${parent.slug}/${page.slug}`;
    }
    return `/universities/${universitySlug}/${page.slug}`;
  };

  const handleDropdownToggle = (pageId: string) => {
    setOpenDropdown(openDropdown === pageId ? null : pageId);
  };

  const renderPageItem = (page: UniversityPage, level: number = 0) => {
    const hasChildren = page.children && page.children.length > 0;
    const isOpen = openDropdown === page.id;
    const isCurrentPage = currentPageSlug === page.slug;

    return (
      <li key={page.id} className="relative">
        <div className="flex items-center">
          <a
            href={getPageUrl(page)}
            className={`flex-1 px-4 py-2 text-sm rounded transition-colors ${
              isCurrentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            style={{ paddingLeft: `${1 + level * 0.5}rem` }}
          >
            {page.title}
          </a>
          
          {hasChildren && (
            <button
              onClick={() => handleDropdownToggle(page.id)}
              className={`p-2 text-gray-500 hover:text-gray-700 ${
                isOpen ? 'rotate-180' : ''
              } transition-transform`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <ul className="mt-1 space-y-1 bg-gray-50 rounded-md">
            {page.children!.map(child => (
              <li key={child.id}>
                <a
                  href={getPageUrl(child, page)}
                  className={`block px-4 py-2 text-sm rounded transition-colors ${
                    currentPageSlug === child.slug
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{ paddingLeft: `${1.5 + level * 0.5}rem` }}
                >
                  {child.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  if (loading) {
    return (
      <nav className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </nav>
    );
  }

  if (pages.length === 0) {
    return null;
  }

  return (
    <nav className={`${className}`}>
      <ul className="space-y-1">
        {pages.map(page => renderPageItem(page))}
      </ul>
    </nav>
  );
};