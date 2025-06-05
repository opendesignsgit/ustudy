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
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
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
      link: '/courses?studyAreas=Media+%26+Communication',
    },
    {
      title: 'LAW',
      description: 'Studying law equips you with critical thinking, problem-solving, and advoca...',
      image: '/media/home/dyapImg2.jpg',
      link: '/courses?studyAreas=Law',
    },
    {
      title: 'BUSINESS',
      description:
        'Master the art of leadership, strategy, and innovation with business program...',
      image: '/media/home/dyapImg3.jpg',
      link: '/courses?studyAreas=Business',
    },
    {
      title: 'MEDICAL',
      description: 'Pursue excellence in healthcare with in-depth medical education, hands-on...',
      image: '/media/home/dyapImg4.jpg',
      link: '/contact-us',
    },
    {
      title: 'Digital Technology',
      description: 'Learn branding, SEO, content, and social media strategy.',
      image: '/media/home/HDigitalTechnology-Img.jpg',
      link: '/courses?studyAreas=Digital+Technology',
    },
    {
      title: 'Digital Marketing',
      description: 'Master SEO, branding, content, and social media strategy.',
      image: '/media/home/HDigitalMarketing-img.jpg',
      link: '/courses?studyAreas=Digital+Marketing',
    },
    {
      title: 'Hospital Management',
      description: 'Learn hospital operations, administration, and patient care systems.',
      image: '/media/home/HHospitalManagement-img.jpg',
      link: '/courses?studyAreas=Hospitality+Management',
    },
    {
      title: 'Computer Science & Engineering',
      description: 'Study programming, AI, software, and cybersecurity fundamentals.',
      image: '/media/home/HComputerScienceEngineering-img.jpg',
      link: '/courses?studyAreas=Computer+science+and+engineering',
    },
    {
      title: 'Hospitality & Tourism',
      description: 'Train in hotels, tourism, and global guest experiences.',
      image: '/media/home/HHospitalityTourism-img.jpg',
      link: '/contact-us',
    },
    {
      title: 'Psychology',
      description: 'Explore behavior, cognition, and mental health science.',
      image: '/media/home/HPsychology-img.jpg',
      link: '/courses?studyAreas=Psychology',
    },
    {
      title: 'Early Childhood & Education',
      description: 'Understand child growth, learning, and teaching strategies.',
      image: '/media/home/HEarlyChildhoodEducation-img.jpg',
      link: '/courses?studyAreas=Education',
    },
    {
      title: 'Media & Communications',
      description: 'Learn journalism, PR, and digital storytelling techniques.',
      image: '/media/home/HMediaCommunication-img.jpg',
      link: '/courses?studyAreas=Media+%26+Communication',
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
                <a href={section.link}>
                  <div className="dyapitemimg relative overflow-hidden rounded-[1.5vw]">
                    <img src={section.image} alt="" className="w-full" />
                    <div className="itemtitle absolute top-0 left-0">
                      <h4>{section.title}</h4>
                    </div>
                  </div>
                  <div className="dyapitemcont">
                    <p>{section.description}</p>
                  </div></a>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}

export default AcademicPathSlider
