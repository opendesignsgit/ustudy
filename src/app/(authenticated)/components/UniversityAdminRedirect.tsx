import React from 'react'

export function UniversityAdminRedirect({ universityData }: { universityData: any }) {
  const handleRedirectToAdmin = () => {
    // Open admin panel in same window
    window.location.href = '/admin'
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-[#34c3ec]">University Admin Panel</h1>
      
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-[#34c3ec] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.349 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.349a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.349 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.349a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Access Your University Admin Panel
            </h3>
            <p className="text-gray-600 mb-6">
              Manage your university content, pages, and settings through our dedicated admin interface.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">What you can do in the Admin Panel:</h4>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• Create and edit university pages with rich content</li>
              <li>• Manage page menus and navigation</li>
              <li>• Upload and organize media files</li>
              <li>• Preview changes before publishing</li>
              <li>• Use advanced content editing tools</li>
            </ul>
          </div>

          <button
            onClick={handleRedirectToAdmin}
            className="bg-[#34c3ec] hover:bg-[#34b2d7] text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Open Admin Panel
          </button>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-center gap-4 text-sm">
              <a
                href="/admin/collections/university-pages"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#34c3ec] hover:text-[#34b2d7] underline"
              >
                Manage Pages
              </a>
              {universityData?.slug && (
                <a
                  href={`/universities/${universityData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#34c3ec] hover:text-[#34b2d7] underline"
                >
                  View Your University Page
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}