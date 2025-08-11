import React from 'react'

type Props = {
  block: any // UniversityProgramsBlock when types are generated
}

export const UniversityPrograms: React.FC<Props> = ({ block }) => {
  const { title, subtitle, programs, layout, showAll, allProgramsLink } = block

  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'list':
        return 'space-y-6'
      case 'carousel':
        return 'flex overflow-x-auto gap-6 pb-4'
      default:
        return 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'undergraduate':
        return 'bg-green-100 text-green-800'
      case 'graduate':
        return 'bg-blue-100 text-blue-800'
      case 'doctoral':
        return 'bg-purple-100 text-purple-800'
      case 'certificate':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Programs */}
        {programs && programs.length > 0 && (
          <div className={getLayoutClasses()}>
            {programs.map((program, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                  layout === 'carousel' ? 'flex-shrink-0 w-80' : ''
                } ${layout === 'list' ? 'flex gap-6' : ''}`}
              >
                {/* Program Image */}
                {program.image && (
                  <div className={layout === 'list' ? 'w-48 flex-shrink-0' : ''}>
                    <img
                      src={typeof program.image === 'object' 
                        ? program.image.url || `/api/media/file/${program.image.filename}` 
                        : program.image
                      }
                      alt={program.title}
                      className={`w-full object-cover ${
                        layout === 'list' ? 'h-full' : 'h-48'
                      }`}
                    />
                  </div>
                )}
                
                {/* Program Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {program.title}
                    </h3>
                    {program.level && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(program.level)}`}>
                        {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {program.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {program.duration && (
                      <span className="text-sm text-gray-500">
                        Duration: {program.duration}
                      </span>
                    )}
                    
                    {program.link && (
                      <a
                        href={program.link}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Learn More →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* View All Button */}
        {showAll && allProgramsLink && (
          <div className="text-center mt-12">
            <a
              href={allProgramsLink}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Programs
            </a>
          </div>
        )}
      </div>
    </section>
  )
}