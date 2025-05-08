'use client'
import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const AcademicPathSlider: React.FC = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const sections = [
    {
      title: 'MEDIA',
      description: 'Gain cutting-edge media skills and hands-on experience to innovate and...',
      image: '/media/home/dyapImg1.jpg',
    },
    {
      title: 'LAW',
      description: 'Studying law equips you with critical thinking, problem-solving, and advoca...',
      image: '/media/home/dyapImg2.jpg',
    },
    {
      title: 'BUSINESS',
      description:
        'Master the art of leadership, strategy, and innovation with business program...',
      image: '/media/home/dyapImg3.jpg',
    },
    {
      title: 'MEDICAL',
      description: 'Pursue excellence in healthcare with in-depth medical education, hands-on...',
      image: '/media/home/dyapImg4.jpg',
    },
  ]

  return (
    <section className="dyapSec secpadblock bg-white relative">
      <div className="container relative">
        <div className="sectitle marbtm textcenter">
          <h2>Discover Your Academic Path</h2>
          <p>
            Explore diverse fields of study and find the perfect program that matches your passion
            and career goals, <br />
            equipping you with the skills and knowledge to thrive in a competitive global landscape.
          </p>
        </div>
        <Slider {...settings} className="dyapSlider">
          {sections.map((section, index) => (
            <div key={index} className="dyapitemsss px-[10px]">
              <div className="dyapitem">
                <div className="dyapitemimg relative overflow-hidden rounded-[1.5vw]">
                  <img src={section.image} alt="" className="w-full" />
                  <div className="itemtitle absolute bottom-0 left-0">
                    <h4>{section.title}</h4>
                  </div>
                </div>
                <div className="dyapitemcont">
                  <p>{section.description}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}

export default AcademicPathSlider
