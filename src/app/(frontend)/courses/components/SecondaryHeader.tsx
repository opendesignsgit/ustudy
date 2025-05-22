// components/Header/SecondaryHeader.tsx
import Link from 'next/link'
import Image from 'next/image'

export const SecondaryHeader = ({ studyAreas, logo }: { studyAreas: string[], logo?: string }) => {
  // Helper function to convert name to URL-friendly slug
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/&/g, 'and')  // Replace '&' with 'and'
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')  // Replace spaces with hyphens
      .trim()
  }

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* University logo */}
          <div className="font-bold text-lg">
            {logo ? (
              <Image 
                src={logo} 
                alt="University Logo" 
                width={120} 
                height={40} 
                className="h-10 object-contain"
              />
            ) : (
              'VERITAS'
            )}
          </div>
          
          {/* Study areas navigation */}
          <nav>
            <ul className="flex space-x-6">
              {studyAreas.map((area) => {
                const slug = createSlug(area)
                return (
                  <li key={slug}>
                    <Link
                      href={`/courses?${slug}`}
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {area}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}