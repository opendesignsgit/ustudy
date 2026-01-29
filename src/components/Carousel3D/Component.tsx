'use client'

import React, { useEffect, useRef } from 'react'
import './carousel3d.css'

// Extend Window interface for jQuery
declare global {
  interface Window {
    $: any
    jQuery: any
  }
}

export interface Carousel3DItem {
  id: number
  image: string
  title: string
  description: string
}

export interface Carousel3DProps {
  items: Carousel3DItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  centerMode?: boolean
}

const Carousel3D: React.FC<Carousel3DProps> = ({
  items,
  autoPlay = true,
  autoPlayInterval = 4000,
  centerMode = true,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const currentIndexRef = useRef(0)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Dynamically import jQuery
    const loadJQuery = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Import jQuery
          const jQuery = await import('jquery')
          // Make jQuery available globally
          ;(window as any).$ = jQuery
          ;(window as any).jQuery = jQuery

          initializeCarousel()
        } catch (error) {
          console.error('Failed to load jQuery:', error)
        }
      }
    }

    loadJQuery()

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
      }
    }
  }, [])

  const initializeCarousel = () => {
    if (!window.$ || !carouselRef.current || items.length === 0) return

    const $ = window.$

    // Initialize carousel positions
    updateCarousel(currentIndexRef.current)

    // Auto-play functionality
    if (autoPlay) {
      autoPlayTimerRef.current = setInterval(() => {
        rotateCarousel('next')
      }, autoPlayInterval)
    }

    // Click handlers for items
    $(carouselRef.current)
      .find('.carousel-3d-item')
      .on('click', function (this: HTMLElement) {
        const index = parseInt($(this).data('index'))
        if (index !== currentIndexRef.current) {
          currentIndexRef.current = index
          updateCarousel(index)
          resetAutoPlay()
        }
      })
  }

  const updateCarousel = (centerIndex: number) => {
    if (!window.$ || !carouselRef.current) return

    const $ = window.$
    const $items = $(carouselRef.current).find('.carousel-3d-item')
    const totalItems = items.length

    $items.each(function (this: HTMLElement, itemIndex: number) {
      const $item = $(this)
      const position = itemIndex - centerIndex

      // Remove all position classes
      $item.removeClass(
        'center left-1 left-2 left-3 right-1 right-2 right-3 hidden',
      )

      // Calculate wrapped position
      let wrappedPosition = position
      if (wrappedPosition > totalItems / 2) {
        wrappedPosition -= totalItems
      } else if (wrappedPosition < -totalItems / 2) {
        wrappedPosition += totalItems
      }

      // Add appropriate position class
      if (wrappedPosition === 0) {
        $item.addClass('center')
      } else if (wrappedPosition === -1) {
        $item.addClass('left-1')
      } else if (wrappedPosition === -2) {
        $item.addClass('left-2')
      } else if (wrappedPosition <= -3) {
        $item.addClass('left-3')
      } else if (wrappedPosition === 1) {
        $item.addClass('right-1')
      } else if (wrappedPosition === 2) {
        $item.addClass('right-2')
      } else if (wrappedPosition >= 3) {
        $item.addClass('right-3')
      }
    })

    // Update indicators
    $(carouselRef.current)
      .find('.carousel-3d-indicator')
      .removeClass('active')
      .eq(centerIndex)
      .addClass('active')
  }

  const rotateCarousel = (direction: 'prev' | 'next') => {
    const totalItems = items.length

    if (direction === 'next') {
      currentIndexRef.current = (currentIndexRef.current + 1) % totalItems
    } else {
      currentIndexRef.current =
        (currentIndexRef.current - 1 + totalItems) % totalItems
    }

    updateCarousel(currentIndexRef.current)
  }

  const resetAutoPlay = () => {
    if (autoPlay && autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      autoPlayTimerRef.current = setInterval(() => {
        rotateCarousel('next')
      }, autoPlayInterval)
    }
  }

  const handlePrev = () => {
    rotateCarousel('prev')
    resetAutoPlay()
  }

  const handleNext = () => {
    rotateCarousel('next')
    resetAutoPlay()
  }

  const handleIndicatorClick = (index: number) => {
    currentIndexRef.current = index
    updateCarousel(index)
    resetAutoPlay()
  }

  return (
    <div className="carousel-3d-container" ref={carouselRef}>
      <div className="carousel-3d-wrapper">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="carousel-3d-item"
            data-index={index}
          >
            <img src={item.image} alt={item.title} />
            <div className="carousel-3d-item-content">
              <div className="carousel-3d-item-title">{item.title}</div>
              <div className="carousel-3d-item-description">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-3d-controls">
        <button
          className="carousel-3d-btn"
          onClick={handlePrev}
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          className="carousel-3d-btn"
          onClick={handleNext}
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <div className="carousel-3d-indicators">
        {items.map((item, index) => (
          <button
            key={item.id}
            className={`carousel-3d-indicator ${index === 0 ? 'active' : ''}`}
            onClick={() => handleIndicatorClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel3D
