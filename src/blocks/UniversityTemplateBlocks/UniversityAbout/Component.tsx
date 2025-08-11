import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  block: any // UniversityAboutBlock when types are generated
}

export const UniversityAbout: React.FC<Props> = ({ block }) => {
  const { title, content, image, stats, layout } = block

  const getLayoutClasses = () => {
    switch (layout) {
      case 'side-by-side':
        return 'grid md:grid-cols-2 gap-8 items-center'
      case 'image-top':
        return 'space-y-8'
      case 'text-only':
        return 'max-w-4xl mx-auto'
      case 'centered':
        return 'text-center max-w-4xl mx-auto'
      default:
        return 'grid md:grid-cols-2 gap-8 items-center'
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className={getLayoutClasses()}>
          {/* Image */}
          {image && layout !== 'text-only' && (
            <div className={layout === 'image-top' ? 'order-first' : ''}>
              <img
                src={typeof image === 'object' ? image.url || `/api/media/file/${image.filename}` : image}
                alt={title}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          
          {/* Content */}
          <div className={layout === 'image-top' ? 'order-last' : ''}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-600 mb-8">
              <RichText data={content} />
            </div>
            
            {/* Statistics */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm font-semibold text-gray-800 mb-1">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div className="text-xs text-gray-600">
                        {stat.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}