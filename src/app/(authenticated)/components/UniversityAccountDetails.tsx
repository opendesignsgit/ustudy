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

  // Helper function to get image URL
  const getImageUrl = (media: any) => {
    if (!media) return null;
    return media.url || null;
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-[#34c3ec]">Account Details</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* University Information Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">University Information</h3>
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

        {/* University Profile Card */}
        <div className="space-y-6">
          {/* Logo Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">University Logo</h3>
            {getImageUrl(universityData?.logo) ? (
              <div className="mb-4">
                <img 
                  src={getImageUrl(universityData.logo)} 
                  alt="University Logo"
                  className="w-32 h-32 object-contain border border-gray-200 rounded"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 border border-gray-200 rounded flex items-center justify-center mb-4">
                <span className="text-gray-400 text-sm">No Logo</span>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Logo management is available in the{' '}
              <a href="/payload/admin" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                CMS Admin Panel
              </a>
            </p>
          </div>

          {/* Country Information */}
          {universityData?.country && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Location</h3>
              <div className="flex items-center gap-3 mb-2">
                {getImageUrl(universityData.country.logo) && (
                  <img 
                    src={getImageUrl(universityData.country.logo)} 
                    alt={universityData.country.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <span className="font-medium">{universityData.country.name}</span>
                <span className="text-sm text-gray-500">({universityData.country.code})</span>
              </div>
              {universityData.country.currencyName && (
                <p className="text-sm text-gray-600">
                  Currency: {universityData.country.currencyName} ({universityData.country.currencyCode})
                </p>
              )}
            </div>
          )}

          {/* Template Information */}
          {universityData?.template && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Website Template</h3>
              <div className="mb-3">
                <h4 className="font-medium">{universityData.template.title}</h4>
                <p className="text-sm text-gray-600">{universityData.template.description}</p>
              </div>
              {getImageUrl(universityData.template.previewImage) && (
                <img 
                  src={getImageUrl(universityData.template.previewImage)} 
                  alt="Template Preview"
                  className="w-full h-24 object-cover rounded border"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}