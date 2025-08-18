import React, { useState } from 'react';

// Account Details Tab Component
export function UniversityAccountDetails({ universityData }: { universityData: any }) {
  const [formData, setFormData] = useState({
    title: universityData?.title || "",
    email: universityData?.email || "",
    phone: universityData?.phone || "",
    websiteUrl: universityData?.websiteUrl || "",
    description: universityData?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University Name
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#34c3ec]"
              placeholder="Enter university name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#34c3ec]"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#34c3ec]"
              placeholder="Enter phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL (Optional)
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#34c3ec]"
              placeholder="https://your-university.edu"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#34c3ec]"
              placeholder="Tell us about your university..."
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#34c3ec] hover:bg-[#34b2d7] disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
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