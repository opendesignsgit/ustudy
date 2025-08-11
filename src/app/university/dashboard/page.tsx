"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from '@/components/Home/footer';

export default function UniversityDashboard() {
  const [selectedTab, setSelectedTab] = useState<"account" | "content" | "view">("account");
  const [universityData, setUniversityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if university user is logged in
    const userType = localStorage.getItem("userType");
    const universityUser = localStorage.getItem("universityUser");
    
    if (userType !== "university" || !universityUser) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(universityUser);
      setUniversityData(userData);
    } catch (error) {
      console.error("Error parsing university user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("universityUser");
    window.dispatchEvent(new Event("authchange"));
    router.push("/login");
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
                onClick={() => setSelectedTab("account")}
              >
                Account Details
              </li>
              <li
                className={`cursor-pointer p-2 rounded hover:bg-gray-700 ${
                  selectedTab === "content" ? "bg-gray-700 font-bold" : ""
                }`}
                onClick={() => setSelectedTab("content")}
              >
                Content Editor
              </li>
              <li
                className={`cursor-pointer p-2 rounded hover:bg-gray-700 ${
                  selectedTab === "view" ? "bg-gray-700 font-bold" : ""
                }`}
                onClick={() => setSelectedTab("view")}
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
        setMessage("Account details updated successfully!");
      } else {
        setMessage("Failed to update account details");
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
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-[#34c3ec]">Content Editor</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-12 text-gray-500">
          <h3 className="text-lg font-medium mb-2">Content Editor Coming Soon</h3>
          <p>Advanced content editing with Lexical editor will be available here.</p>
          <p className="mt-2 text-sm">You can currently edit content through the Payload CMS admin interface.</p>
          <a 
            href="/admin" 
            target="_blank"
            className="inline-block mt-4 bg-[#34c3ec] hover:bg-[#34b2d7] text-white px-4 py-2 rounded"
          >
            Open CMS Admin
          </a>
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