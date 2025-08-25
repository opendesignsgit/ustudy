import React, { useState, useEffect } from 'react';

interface UniversityPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  showInMenu: boolean;
  menuOrder: number;
  updatedAt: string;
}

export function UniversityPagesManager({ universityData }: { universityData: any }) {
  const [pages, setPages] = useState<UniversityPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState('');
  const [newPage, setNewPage] = useState({
    title: '',
    description: '',
    showInMenu: true,
    menuOrder: 0,
  });

  useEffect(() => {
    fetchPages();
  }, [universityData]);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !universityData?.id) return;

      const response = await fetch(`/api/university-pages?where[university][equals]=${universityData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPages(data.docs || []);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token || !universityData?.id) return;

      const response = await fetch('/api/university-pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPage,
          university: universityData.id,
          content: '<p>Add your content here...</p>',
        }),
      });

      if (response.ok) {
        setMessage('Page created successfully!');
        setNewPage({ title: '', description: '', showInMenu: true, menuOrder: 0 });
        setShowAddForm(false);
        fetchPages();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to create page');
      }
    } catch (error) {
      setMessage('Error creating page');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/university-pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage('Page deleted successfully!');
        fetchPages();
      } else {
        setMessage('Failed to delete page');
      }
    } catch (error) {
      setMessage('Error deleting page');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading pages...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-[#34c3ec]">University Pages</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Manage Your University Pages</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#34c3ec] hover:bg-[#34b2d7] text-white px-4 py-2 rounded-md"
          >
            {showAddForm ? 'Cancel' : 'Add New Page'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddPage} className="mb-6 p-4 border border-gray-200 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Order
                </label>
                <input
                  type="number"
                  value={newPage.menuOrder}
                  onChange={(e) => setNewPage({ ...newPage, menuOrder: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newPage.description}
                onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newPage.showInMenu}
                  onChange={(e) => setNewPage({ ...newPage, showInMenu: e.target.checked })}
                  className="mr-2"
                />
                Show in university menu
              </label>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mr-2"
              >
                Create Page
              </button>
            </div>
          </form>
        )}

        {pages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No pages created yet.</p>
            <p className="text-sm mt-2">Create your first page to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pages.map((page) => (
              <div key={page.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{page.title}</h4>
                    {page.description && (
                      <p className="text-gray-600 text-sm mt-1">{page.description}</p>
                    )}
                    <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                      <span>Slug: /universities/{universityData?.slug}/{page.slug}</span>
                      <span>Order: {page.menuOrder}</span>
                      <span>{page.showInMenu ? 'Shown in menu' : 'Hidden from menu'}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={`/universities/${universityData?.slug}/${page.slug}`}
                      target="_blank"
                      className="text-[#34c3ec] hover:text-[#34b2d7] text-sm"
                    >
                      View →
                    </a>
                    <a
                      href={`/payload/admin/collections/university-pages/${page.id}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDeletePage(page.id)}
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

        {message && (
          <div className={`mt-4 p-3 rounded text-sm ${
            message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">How it works</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Create pages that will be accessible at /universities/{universityData?.slug}/[page-slug]</li>
            <li>• Pages with "Show in menu" enabled will appear in your university navigation</li>
            <li>• Use Menu Order to control the order of pages in navigation (lower numbers first)</li>
            <li>• Click "Edit" to modify page content using the CMS editor</li>
          </ul>
        </div>
      </div>
    </div>
  );
}