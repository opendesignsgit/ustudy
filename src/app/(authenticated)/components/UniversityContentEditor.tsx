import React, { useState } from 'react';
import { LexicalEditor } from './LexicalEditor';

// Content Editor Tab Component
export function UniversityContentEditor({ universityData }: { universityData: any }) {
  // Handle the content structure from the API response
  const initialContent = universityData?.content ? 
    (typeof universityData.content === 'string' ? universityData.content : JSON.stringify(universityData.content)) : 
    '';
  
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

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
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-[#34c3ec]">Content Editor</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">University Content</h3>
          <p className="text-gray-600 text-sm mb-4">
            Create rich content for your university page using the full-featured editor below. This editor supports headings, formatting, lists, links, and more.
          </p>
        </div>
        
        <div className="mb-6">
          <LexicalEditor 
            initialContent={content}
            onChange={handleContentChange}
            placeholder="Start creating your university content here..."
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
              rel="noopener noreferrer"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
            >
              Open CMS Admin
            </a>
            {universityData?.slug && (
              <a
                href={`/university/${universityData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                Preview University Page
              </a>
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
    </div>
  );
}