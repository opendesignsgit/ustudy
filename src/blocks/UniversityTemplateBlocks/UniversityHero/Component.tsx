import React from 'react'

type Props = {
  block: any // UniversityHeroBlock when types are generated
}

export const UniversityHero: React.FC<Props> = ({ block }) => {
  const { title, subtitle, backgroundImage, buttons, style } = block

  const getStyleClasses = () => {
    switch (style) {
      case 'centered':
        return 'text-center'
      case 'left':
        return 'text-left'
      case 'overlay':
        return 'text-center relative'
      default:
        return 'text-center'
    }
  }

  const getButtonClasses = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors'
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors'
      case 'outline':
        return 'border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors'
    }
  }

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={typeof backgroundImage === 'object' ? backgroundImage.url || `/api/media/file/${backgroundImage.filename}` : backgroundImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}
      
      {/* Content */}
      <div className={`relative z-10 max-w-6xl mx-auto px-4 py-16 text-white ${getStyleClasses()}`}>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>
        )}
        
        {buttons && buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button, index) => (
              <a
                key={index}
                href={button.url}
                className={getButtonClasses(button.style || 'primary')}
              >
                {button.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}