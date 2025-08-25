import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

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

interface UniversityMenuProps {
  universityId: string | number;
  universitySlug: string;
  currentPageSlug?: string;
  className?: string;
}

export const UniversityMenu: React.FC<UniversityMenuProps> = async ({ 
  universityId, 
  universitySlug, 
  currentPageSlug, 
  className = '' 
}) => {
  try {
    const payload = await getPayload({ config: configPromise })

    // Fetch all published pages for this university that should show in menu
    const pagesResult = await payload.find({
      collection: 'university-pages',
      where: {
        and: [
          {
            university: {
              equals: universityId,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
          {
            showInMenu: {
              equals: true,
            },
          },
        ],
      },
      sort: 'menuOrder',
      limit: 100,
    })

    const allPages = pagesResult.docs || []
    
    // Build hierarchical structure
    const hierarchicalPages = buildHierarchy(allPages)

    if (hierarchicalPages.length === 0) {
      return null
    }

    return (
      <nav className={`bg-white shadow-sm border rounded-lg p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">University Pages</h3>
        <ul className="space-y-2">
          {hierarchicalPages.map(page => (
            <PageMenuItem 
              key={page.id} 
              page={page} 
              universitySlug={universitySlug}
              currentPageSlug={currentPageSlug}
              level={0}
            />
          ))}
        </ul>
      </nav>
    )
  } catch (error) {
    console.error('Error fetching university menu:', error)
    return null
  }
}

const PageMenuItem: React.FC<{
  page: UniversityPage;
  universitySlug: string;
  currentPageSlug?: string;
  level: number;
}> = ({ page, universitySlug, currentPageSlug, level }) => {
  const hasChildren = page.children && page.children.length > 0
  const isCurrentPage = currentPageSlug === page.slug

  const getPageUrl = (page: UniversityPage, parent?: UniversityPage): string => {
    if (parent) {
      return `/universities/${universitySlug}/${parent.slug}/${page.slug}`
    }
    return `/universities/${universitySlug}/${page.slug}`
  }

  return (
    <li>
      <a
        href={getPageUrl(page)}
        className={`block px-3 py-2 text-sm rounded transition-colors ${
          isCurrentPage
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${0.75 + level * 0.5}rem` }}
      >
        {page.title}
      </a>
      
      {hasChildren && (
        <ul className="mt-1 space-y-1">
          {page.children!.map(child => (
            <li key={child.id}>
              <a
                href={getPageUrl(child, page)}
                className={`block px-3 py-2 text-sm rounded transition-colors ${
                  currentPageSlug === child.slug
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={{ paddingLeft: `${1.25 + level * 0.5}rem` }}
              >
                {child.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

const buildHierarchy = (pages: any[]): UniversityPage[] => {
  // Create a map for quick lookup
  const pageMap = new Map<string, UniversityPage>()
  const rootPages: UniversityPage[] = []

  // Initialize all pages with empty children array
  pages.forEach(page => {
    pageMap.set(page.id, { ...page, children: [] })
  })

  // Build the hierarchy
  pages.forEach(page => {
    const pageWithChildren = pageMap.get(page.id)!
    
    if (page.parent) {
      // This page has a parent, add it to parent's children
      const parentId = typeof page.parent === 'object' ? page.parent.id : page.parent
      const parent = pageMap.get(parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(pageWithChildren)
      }
    } else {
      // This is a root level page
      rootPages.push(pageWithChildren)
    }
  })

  // Sort children by menuOrder
  const sortByOrder = (pages: UniversityPage[]) => {
    pages.sort((a, b) => a.menuOrder - b.menuOrder)
    pages.forEach(page => {
      if (page.children && page.children.length > 0) {
        sortByOrder(page.children)
      }
    })
  }

  sortByOrder(rootPages)
  return rootPages
}