"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/providers/Auth';
import Footer from '@/components/Home/footer';
import { LexicalEditor } from './components/LexicalEditor';
import './components/LexicalEditor.css';

export default function UniversityDashboard() {
  const [selectedTab, setSelectedTab] = useState<"account" | "content" | "pages" | "view">("account");
  const [universityData, setUniversityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { universityUser, userType, loading: authLoading } = useAuth();

  // Redirect if not authenticated or not a university user
  useEffect(() => {
    if (!authLoading && (!universityUser || userType !== 'university')) {
      router.push('/login');
      return;
    }
  }, [universityUser, userType, authLoading, router]);

  // Sync tab from URL on mount and when popstate occurs
  useEffect(() => {
    const getTab = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        switch (tab) {
          case 'content':
            setSelectedTab('content');
            break;
          case 'pages':
            setSelectedTab('pages');
            break;
          case 'view':
            setSelectedTab('view');
            break;
          default:
            setSelectedTab('account');
        }
      }
    };

    getTab();
    window.addEventListener('popstate', getTab);

    return () => window.removeEventListener('popstate', getTab);
  }, []);

  const handleTabChange = (tab: "account" | "content" | "pages" | "view") => {
    setSelectedTab(tab);
    let param = '';
    if (tab === 'content') param = 'content';
    if (tab === 'pages') param = 'pages';
    if (tab === 'view') param = 'view';
    // Update query string without reload
    if (typeof window !== "undefined") {
      const base = window.location.pathname;
      const url = param ? `${base}?tab=${param}` : base;
      window.history.pushState({}, '', url);
    }
  };

  useEffect(() => {
    const fetchUniversityData = async () => {
      // Don't fetch if not authenticated
      if (!universityUser || userType !== 'university') {
        setLoading(false);
        return;
      }

      try {
        // Use the authenticated university user data from context
        setUniversityData(universityUser);
        setLoading(false);
      } catch (error) {
        console.error("Error setting university data:", error);
        // Only fall back to demo data if we can't use auth context data
        const demoData = getDemoUniversityData();
        setUniversityData(demoData);
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [universityUser, userType]);

  const getDemoUniversityData = () => ({
    id: 'demo-university',
    title: 'Demo University',
    email: 'contact@demouniversity.edu',
    phone: '+1-555-123-4567',
    websiteUrl: 'https://demouniversity.edu',
    description: 'A demonstration university for testing the dashboard functionality.',
    slug: 'demo-university',
    content: '<p>Welcome to Demo University! We are committed to excellence in education.</p>'
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("universityUser");
    window.dispatchEvent(new Event("authchange"));
    router.push("/login");
  };

  // Show loading while authenticating
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (this should not show due to useEffect redirect)
  if (!universityUser || userType !== 'university') {
    return null;
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case "account":
        return <AccountDetailsTab universityData={universityData} />;
      case "content":
        return <ContentEditorTab universityData={universityData} />;
      case "pages":
        return <PagesManagementTab universityData={universityData} />;
      case "view":
        return <ViewUniversityTab universityData={universityData} />;
      default:
        return <AccountDetailsTab universityData={universityData} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!universityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Access denied</div>
      </div>
    );
  }

  return (
    <article>
      <div className="dashboard-container flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-4 text-white">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#34c3ec]">
              {universityData.title || "University"}
            </h2>
            <p className="text-sm text-gray-300">Dashboard</p>
          </div>
          
          <nav>
            <ul className="space-y-2">
              <li
                className={`cursor-pointer p-2 rounded hover:bg-gray-700 ${
                  selectedTab === "account" ? "bg-gray-700 font-bold" : ""
                }`}
                onClick={() => handleTabChange("account")}
              >
                Account Details
              </li>
              <li
                className={`cursor-pointer p-2 rounded hover:bg-gray-700 ${
                  selectedTab === "content" ? "bg-gray-700 font-bold" : ""
                }`}
                onClick={() => handleTabChange("content")}
              >
                Content Editor
              </li>
              <li
                className={`cursor-pointer p-2 rounded hover:bg-gray-700 ${
                  selectedTab === "pages" ? "bg-gray-700 font-bold" : ""
                }`}
                onClick={() => handleTabChange("pages")}
              >
                Manage Pages
              </li>
              <li
                className={`cursor-pointer p-2 rounded hover:bg-gray-700 ${
                  selectedTab === "view" ? "bg-gray-700 font-bold" : ""
                }`}
                onClick={() => handleTabChange("view")}
              >
                View University Page
              </li>
              <li
                className="cursor-pointer p-2 rounded hover:bg-gray-700 text-red-400"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50 text-gray-900">
          {renderTabContent()}
        </main>
      </div>
      <Footer />
    </article>
  );
}

// Account Details Tab Component
function AccountDetailsTab({ universityData }: { universityData: any }) {
  const [formData, setFormData] = useState({
    title: universityData?.title || "",
    email: universityData?.email || "",
    phone: universityData?.phone || "",
    websiteUrl: universityData?.websiteUrl || "",
    description: universityData?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    
    try {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");
      
      if (userType === "university" && token && universityData?.id) {
        const response = await fetch(`/api/universities/${universityData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          const updatedData = await response.json();
          localStorage.setItem("universityUser", JSON.stringify(updatedData));
          // Update the universityData in parent component would require state lifting
          // For now, just show success message
          setMessage("Account details updated successfully!");
          window.dispatchEvent(new Event("authchange")); // Trigger auth state update
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || "Failed to update account details");
        }
      } else {
        // Demo mode
        setMessage("Demo mode: Account details would be updated in a real application");
      }
    } catch (error) {
      setMessage("Error updating account details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-[#34c3ec]">Account Details</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University Name
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#34c3ec] hover:bg-[#34b2d7] text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
        
        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// Content Editor Tab Component
function ContentEditorTab({ universityData }: { universityData: any }) {
  const [content, setContent] = useState(() => {
    // Try to get content from localStorage first (for demo)
    const savedContent = localStorage.getItem(`university_content_${universityData?.id || 'demo'}`);
    return savedContent || universityData?.content || '<p>Welcome to our university! Edit this content using the rich text editor.</p>';
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");
      
      if (userType === "university" && token && universityData?.id) {
        // Try to save to API first
        const response = await fetch(`/api/universities/${universityData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        });
        
        if (response.ok) {
          const updatedData = await response.json();
          localStorage.setItem("universityUser", JSON.stringify(updatedData));
          setMessage("Content saved successfully!");
        } else {
          // Fallback to localStorage if API fails
          localStorage.setItem(`university_content_${universityData?.id || 'demo'}`, content);
          setMessage("Content saved locally (API unavailable)");
        }
      } else {
        // Demo mode - save to localStorage
        localStorage.setItem(`university_content_${universityData?.id || 'demo'}`, content);
        setMessage("Content saved successfully! (Demo: saved to browser storage)");
      }
    } catch (error) {
      // Fallback to localStorage on error
      localStorage.setItem(`university_content_${universityData?.id || 'demo'}`, content);
      setMessage("Content saved locally (offline mode)");
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-[#34c3ec]">Content Editor</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-4">
            Edit your university&apos;s content using the rich text editor below. This content will be displayed on your university page.
            You can add/remove blocks, format text, and structure your content as needed.
          </p>
          
          <div className="border rounded-lg overflow-hidden">
            <LexicalEditor
              initialContent={content}
              onChange={handleContentChange}
            />
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#34c3ec] hover:bg-[#34b2d7] text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Content"}
              </button>
              
              <a 
                href="/admin" 
                target="_blank"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
              >
                Open CMS Admin
              </a>
            </div>
            
            {universityData?.slug && (
              <a
                href={`/universities/${universityData.slug}`}
                target="_blank"
                className="text-[#34c3ec] hover:text-[#34b2d7] text-sm"
              >
                Preview Page →
              </a>
            )}
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded text-sm ${
              message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Pages Management Tab Component
function PagesManagementTab({ universityData }: { universityData: any }) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [message, setMessage] = useState('');

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !universityData?.id) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/university-pages?where[university][equals]=${universityData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPages(data.docs || []);
      } else {
        console.error('Failed to fetch pages');
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPage = async () => {
    if (!newPageTitle.trim()) {
      setMessage('Page title is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Not authenticated');
        return;
      }

      const slug = newPageSlug.trim() || newPageTitle.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      const pageData = {
        title: newPageTitle.trim(),
        slug: slug,
        university: universityData.id,
        published: true,
        layout: [
          {
            blockType: 'content',
            content: {
              root: {
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: `Welcome to ${newPageTitle}`,
                        type: 'text',
                        version: 1
                      }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'heading',
                    version: 1,
                    tag: 'h1'
                  },
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Edit this content to customize your page.',
                        type: 'text',
                        version: 1
                      }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1
                  }
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1
              }
            }
          }
        ]
      };

      const response = await fetch('/api/university-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(pageData),
      });

      if (response.ok) {
        setMessage('Page created successfully');
        setNewPageTitle('');
        setNewPageSlug('');
        setShowCreateForm(false);
        fetchPages();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to create page');
      }
    } catch (error) {
      setMessage('Error creating page');
      console.error('Error creating page:', error);
    }
  };

  const deletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Not authenticated');
        return;
      }

      const response = await fetch(`/api/university-pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage('Page deleted successfully');
        fetchPages();
      } else {
        setMessage('Failed to delete page');
      }
    } catch (error) {
      setMessage('Error deleting page');
      console.error('Error deleting page:', error);
    }
  };

  React.useEffect(() => {
    if (universityData?.id) {
      fetchPages();
    }
  }, [universityData?.id]);

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#34c3ec]">Manage Pages</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-[#34c3ec] hover:bg-[#34b2d7] text-white px-4 py-2 rounded-lg"
        >
          {showCreateForm ? 'Cancel' : 'Create New Page'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-medium mb-4">Create New Page</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#34c3ec]"
                placeholder="e.g., About Us, Admissions, Research"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Slug (URL path)
              </label>
              <input
                type="text"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#34c3ec]"
                placeholder="e.g., about-us, admissions, research (leave empty to auto-generate)"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={createPage}
                className="bg-[#34c3ec] hover:bg-[#34b2d7] text-white px-4 py-2 rounded-md"
              >
                Create Page
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Your Pages</h3>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading pages...</div>
          ) : pages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pages created yet.</p>
              <p className="text-sm mt-2">Create your first page to add custom content to your university website.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{page.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        URL: /university/{universityData?.slug || 'university-slug'}/{page.slug}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          page.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Updated: {new Date(page.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <a
                        href={`/admin/collections/university-pages/${page.id}`}
                        target="_blank"
                        className="text-[#34c3ec] hover:text-[#34b2d7] text-sm"
                      >
                        Edit
                      </a>
                      <a
                        href={`/university/${universityData?.slug || 'university-slug'}/${page.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                      <button
                        onClick={() => deletePage(page.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded text-sm ${
          message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

// View University Tab Component  
function ViewUniversityTab({ universityData }: { universityData: any }) {
  const universitySlug = universityData?.slug || universityData?.title?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-[#34c3ec]">University Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-4">Your University Page</h3>
          <p className="text-gray-600 mb-6">
            Preview how your university page will appear to visitors.
          </p>
          
          {universitySlug ? (
            <div className="space-y-4">
              <a
                href={`/universities/${universitySlug}`}
                target="_blank"
                className="inline-block bg-[#34c3ec] hover:bg-[#34b2d7] text-white px-6 py-3 rounded-lg"
              >
                View Live Page
              </a>
              <div className="text-sm text-gray-500">
                URL: {typeof window !== 'undefined' ? window.location.origin : ''}/universities/{universitySlug}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              <p>University page URL not available.</p>
              <p className="text-sm mt-2">Please ensure your university profile is complete.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}