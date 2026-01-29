'use client'

import React from 'react'
import Carousel3D, { Carousel3DItem } from '@/components/Carousel3D'

const CarouselDemoPage: React.FC = () => {
  const carouselItems: Carousel3DItem[] = [
    {
      id: 1,
      image: '/media/home/hstuwwImg.jpg',
      title: 'Brickfields Asia College',
      description: 'Premier education institution in Malaysia',
    },
    {
      id: 2,
      image: '/media/home/h-bac-singapore-img.jpg',
      title: 'BAC Singapore',
      description: 'Excellence in education and research',
    },
    {
      id: 3,
      image: '/media/home/h-veritas-malaysia-img.jpg',
      title: 'Veritas University College',
      description: 'Quality education in Malaysia',
    },
    {
      id: 4,
      image: '/media/home/hstuwwImg.jpg',
      title: 'International University',
      description: 'Global education standards',
    },
    {
      id: 5,
      image: '/media/home/h-bac-singapore-img.jpg',
      title: 'Technology Institute',
      description: 'Cutting-edge technology programs',
    },
    {
      id: 6,
      image: '/media/home/h-veritas-malaysia-img.jpg',
      title: 'Business School',
      description: 'Leading business education',
    },
    {
      id: 7,
      image: '/media/home/hstuwwImg.jpg',
      title: 'Medical Academy',
      description: 'Healthcare education excellence',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            3D Carousel with Center Mode
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience a stunning 3D carousel built with jQuery, HTML, and CSS.
            Features center mode with smooth animations and responsive design.
          </p>
        </div>

        <Carousel3D
          items={carouselItems}
          autoPlay={true}
          autoPlayInterval={4000}
          centerMode={true}
        />

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>
                <strong>3D Transform Effects:</strong> Items rotate and scale in 3D space
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>
                <strong>Center Mode:</strong> The center item is highlighted and scaled larger
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>
                <strong>jQuery Integration:</strong> Powered by jQuery for smooth interactions
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>
                <strong>Auto-play:</strong> Automatically cycles through items
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>
                <strong>Navigation Controls:</strong> Previous/Next buttons and dot indicators
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>
                <strong>Responsive Design:</strong> Adapts to different screen sizes
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>
                <strong>Click to Focus:</strong> Click any item to bring it to center
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-blue-900 mb-3">Usage Instructions</h3>
          <div className="text-blue-800 space-y-2">
            <p>• Use the left and right arrow buttons to navigate through items</p>
            <p>• Click on any item to bring it to the center</p>
            <p>• Click on the dot indicators to jump to a specific item</p>
            <p>• The carousel will auto-play every 4 seconds (pauses on interaction)</p>
            <p>• Hover over items to see zoom effects on images</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarouselDemoPage
