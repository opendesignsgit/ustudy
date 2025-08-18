import React, { useState } from 'react';
import { LexicalEditor } from '../university-dashboard/components/LexicalEditor';

// Content Editor Tab Component
export function UniversityContentEditor({ universityData }: { universityData: any }) {
  const [content, setContent] = useState(universityData?.content || '<p>Welcome to our university!</p>');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      
      if (token && universityData?.id) {
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
          setMessage("Content updated successfully!");
          window.dispatchEvent(new Event("authchange"));
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || "Failed to update content");
        }
      } else {
        setMessage("Demo mode: Content would be updated in a real application");
      }
    } catch (error) {
      setMessage("Error updating content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-[#34c3ec]">Content Editor</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">University Description</h3>
          <p className="text-gray-600 text-sm mb-4">
            Edit the content that will appear on your university's public page.
          </p>
        </div>
        
        <div className="border border-gray-300 rounded-md">
          <LexicalEditor
            initialContent={content}
            onChange={setContent}
          />
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#34c3ec] hover:bg-[#34b2d7] disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
            >
              {saving ? "Saving..." : "Save Content"}
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Changes will be reflected on your public university page.</p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">Quick Actions</h4>
          <div className="flex gap-3">
            <a
              href="/payload/admin"
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
  );
}