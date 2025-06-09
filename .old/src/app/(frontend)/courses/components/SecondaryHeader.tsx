// components/Header/SecondaryHeader.tsx
import Link from 'next/link'
import Image from 'next/image'

type StudyArea = {
  id: string | number;
  name: string;
  slug?: string;
}

export const SecondaryHeader = ({
  studyAreas,
  logo
}: {
  studyAreas: StudyArea[]; // Now accepts an array of StudyArea objects
  logo?: string | null;
}) => {
  // Helper function to convert name to URL-friendly slug
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }
  console.log(logo);


  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* University logo */}
          <div className="colgelogo">
            {logo ? (
              <Image
                src={logo}
                alt="University Logo"
                width={120}
                height={40}
                className="h-10 object-contain"
                priority
              />
            ) : (
              <span className="text-xl font-bold">VERITAS</span>
            )}
          </div>

          {/* Study areas navigation */}
          <nav>
            <ul className="flex space-x-6">
              {studyAreas.map((area) => {
                const slug = area.slug || createSlug(area.name)
                return (
                  <li key={area.id}>
                    <Link
                      href={`/courses?studyArea=${slug}`}
                      className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
                    >
                      {area.name}
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
//Final