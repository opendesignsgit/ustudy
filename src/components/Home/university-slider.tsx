'use client'

import React, { useEffect, useRef, useState } from 'react'

const UniversitySlider = () => {
  const [activeIndex, setActiveIndex] = useState(2) // Start with center item active
  const carouselRef = useRef(null)
  const autoRef = useRef<NodeJS.Timeout | null>(null)

  const carouselItems = [
    {
      name: 'Brickfields Asia College (BAC) - Malaysia',
      image: '/media/home/hstuwwImg.jpg',
    },
    {
      name: 'Brickfields Asia College (BAC) - Malaysia',
      image: '/media/home/hstuwwImg.jpg',
    },
    {
      name: 'Brickfields Asia College (BAC) - Malaysia',
      image: '/media/home/hstuwwImg.jpg',
    },
    {
      name: 'Brickfields Asia College (BAC) - Malaysia',
      image: '/media/home/hstuwwImg.jpg',
    },
  ]

  const visibleItems = 3
  const centerIndex = Math.floor(visibleItems / 2)

  const getDisplayItems = () => {
    const totalItems = carouselItems.length
    const displayItems: Array<{ name: string; image: string }> = [] // Add type annotation

    // Calculate the range of indices to display
    for (let i = -centerIndex; i <= centerIndex; i++) {
      const index = (activeIndex + i + totalItems) % totalItems
      displayItems.push(carouselItems[index])
    }

    return displayItems
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
    resetAutoSlide()
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length)
    resetAutoSlide()
  }

  const resetAutoSlide = () => {
    if (autoRef.current) {
      clearInterval(autoRef.current)
    }
    autoRef.current = setInterval(handleNext, 6000)
  }

  // In your useEffect:
  useEffect(() => {
    autoRef.current = setInterval(handleNext, 6000)
    return () => {
      if (autoRef.current) {
        clearInterval(autoRef.current)
      }
    }
  }, [])

  return (
    <section className="bg-white hstuwwSec">
      <div className="container relative">
        <div className="sectitle marbtm textcenter">
          <h2>Study at Top Universities Worldwide</h2>
          <p>
            Join prestigious institutions offering world-class education. Gain valuable skills{' '}
            <br />
            and globally recognized certifications for a successful future!
          </p>
        </div>
        <div className="relative w-full ">
          <div
            ref={carouselRef}
            className="flex items-center justify-center gap-6 p-0 h-[70vh] w-full overflow-hidden'" // Set fixed height here
          >
            {getDisplayItems().map((item, index) => {
              const isActive = index === centerIndex
              const itemIndex =
                (activeIndex - centerIndex + index + carouselItems.length) % carouselItems.length

              return (
                <div
                  key={`${itemIndex}-${item.name}`}
                  className={`
                hstuwwItems relative transition-all duration-500 ease-in-out
                ${isActive ? 'w-[68%]' : 'w-[8%]'}
                ${isActive ? 'active' : ''}
                h-full All items take full height of 
                rounded-[1.5vw] overflow-hidden
                ${isActive ? 'z-10' : 'z-0'}
                bg-card/20
              `}
                  onClick={() => {
                    setActiveIndex(itemIndex)
                    resetAutoSlide()
                  }}
                  tabIndex={0}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`
                  absolute inset-0 w-full h-full object-cover
                  ${isActive ? 'saturate-100 contrast-100 brightness-100' : 'saturate-20 contrast-75 brightness-110'}
                `}
                  />

                  <div className="slidecontent absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white text-2xl font-semibold tracking-wide">{item.name}</h3>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pnbtnlist flex justify-center">
            <button onClick={handlePrev} className="slickprev slickarrow">
              Previous
            </button>
            <button onClick={handleNext} className="slicknext slickarrow">
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UniversitySlider
//final
