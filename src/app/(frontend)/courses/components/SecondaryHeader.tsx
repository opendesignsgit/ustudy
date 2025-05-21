// components/Header/SecondaryHeader.tsx
import Link from 'next/link'

interface StudyArea {
  id: string
  name: string
  slug: string
}

export const SecondaryHeader = ({ studyAreas }: { studyAreas: StudyArea[] }) => {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* University name/logo */}
          <div className="font-bold text-lg">VERITAS</div>
          
          {/* Study areas navigation */}
          <nav>
            <ul className="flex space-x-6">
              {studyAreas.map((area) => (
                <li key={area.id}>
                  <Link
                    href={`/study-areas/${area.slug}`}
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
        </div>
      </div>
    </header>
  )
}