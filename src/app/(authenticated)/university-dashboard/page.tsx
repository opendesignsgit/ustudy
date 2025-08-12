"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from '@/components/Home/footer';
import { LexicalEditor } from './components/LexicalEditor';
import './components/LexicalEditor.css';

export default function UniversityDashboard() {
  const [selectedTab, setSelectedTab] = useState<"account" | "content" | "view">("account");
  const [universityData, setUniversityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleTabChange = (tab: "account" | "content" | "view") => {
    setSelectedTab(tab);
    let param = '';
    if (tab === 'content') param = 'content';
    if (tab === 'view') param = 'view';
    // Update query string without reload
    if (typeof window !== "undefined") {
      const base = window.location.pathname;
      const url = param ? `${base}?tab=${param}` : base;
      window.history.pushState({}, '', url);
    }
  };

  useEffect(() => {
    // For demo purposes, allow access with mock data if no user is logged in
    const userType = localStorage.getItem("userType");
    const universityUser = localStorage.getItem("universityUser");
    
    if (userType === "university" && universityUser) {
      try {
        const userData = JSON.parse(universityUser);
        setUniversityData(userData);
      } catch (error) {
        console.error("Error parsing university user data:", error);
        // Use demo data if parsing fails
        setUniversityData(getDemoUniversityData());
      }
    } else {
      // For demo purposes, provide mock university data
      const demoData = getDemoUniversityData();
      setUniversityData(demoData);
    }
    
    setLoading(false);
  }, [router]);

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
    // For demo, redirect to home instead of login
    router.push("/");
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "account":
        return <AccountDetailsTab universityData={universityData} />;
      case "content":
        return <ContentEditorTab universityData={universityData} />;
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
            Edit your university's content using the rich text editor below. This content will be displayed on your university page.
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
                href={`/university/${universitySlug}`}
                target="_blank"
                className="inline-block bg-[#34c3ec] hover:bg-[#34b2d7] text-white px-6 py-3 rounded-lg"
              >
                View Live Page
              </a>
              <div className="text-sm text-gray-500">
                URL: {window.location.origin}/university/{universitySlug}
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