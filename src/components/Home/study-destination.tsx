'use client'
import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const destinations = [
  {
    name: 'Malaysia',
    image: '/media/home/fpsdImg1.jpg', // Replace with actual image URL
  },
  {
    name: 'Singapore',
    image: '/media/home/fpsdImg2.jpg', // Replace with actual image URL
  },
]

const StudyDestinationCarousel: React.FC = () => {
  const settings = {
    dots: false,
    arrow: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <section className="secpadblock hfpsdSec bg-white">
      <div className="container relative">
        <div className="sectitle marbtm textcenter">
          <h2>Find Your Perfect Study Destination</h2>
          <p>
            Explore top universities and courses worldwide. Choose the best place to <br />
            shape your future and achieve your dreams!
          </p>
        </div>
        <Slider {...settings} className="hfpsdSlider">
          {destinations.map((destination, index) => (
            <div key={index} className="px-2">
              <div className="hfpsdSItems overflow-hidden relative">
                <img className="w-full" src={destination.image} alt={destination.name} />
                <h4 className="hfpsdtitle absolute top-0 left-0 bg-blue-700 text-white">
                  {destination.name}
                </h4>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}

export default StudyDestinationCarousel
