import React from 'react';

// View University Tab Component  
export function UniversityPageView({ universityData }: { universityData: any }) {
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
                URL: {typeof window !== 'undefined' ? window.location.origin : ''}/university/{universitySlug}
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