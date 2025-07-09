'use client'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faGavel,
  faFilm,
  faLaptopCode,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const EducationPromoSection = () => {
  const leftMenuItems = [
    { name: 'Business', image: '/media/home/hbusiness-icon.png', link: '/courses?studyAreas=Business' },
    { name: 'Law', image: '/media/home/hlaw-icon.png', link: '/courses?studyAreas=Law' },
    { name: 'Media', image: '/media/home/hmedia-icon.png', link: '/courses?studyAreas=Media+%26+Communication' },
    { name: 'Digital Technology', image: '/media/home/hdigitaltech-icon.png', link: '/courses?studyAreas=Digital+Technology' },
  ]

  const rightMenuItems = [
    { name: 'Kazakhstan', image: '/media/home/flag-kazakhstan-icon.png' },
    { name: 'Barbados', image: '/media/home/flag-barbados-icon.png' },
    { name: 'Kyrgyzstan', image: '/media/home/flag-kyrgyzstan-icon.png' },
    { name: 'Tajikistan', image: '/media/home/flag-tajikistan-icon.png' },
  ]
  const router = useRouter();

  const handleClick = () => {
    router.push('/courses?countries=Malaysia&countries=Singapore&universities=BAC+-+Malaysia&universities=BAC+-+Singapore&universities=Veritas+University+College'); // change to your desired route
  };
  const ContactClick = () => {
    router.push('/contact-us#contformSec'); // change to your desired route
  };
  return (
    <section className="relative w-full h-screen hbanersec  relative">
      {/* Left Section */}
      <div className="container relative h-full z-10">
        <div className="flex flex-col md:flex-row relative md h-full hbanerinrowsec">
          {/* Center Image */}
          <div className="absolute bottom-0 left-[50%] -translate-x-[50%] flex justify-center items-end pointer-events-none hbancol hbanimgcol">
            <h2 className="hidden">
              Your Global Education Journey Begins Here
            </h2>
            <div className="hbanmig">
              <img
                src="/media/home/hban-girl-img.png" // Replace with the actual path to the image
                alt="Student"
                className="w-full h-auto object-cover z-10"
              />
            </div>
          </div>
          <div className="flex-1 text-white flex flex-col justify-center items-start relative  pr-[9vw] hbancol colLeft">
            <h1 className="leading-snug">
              Earn <span>While</span> <br />
              <span>you Learn</span> Online
            </h1>
            <p className="mt-6  font-medium">
              Learn anytime, anywhere with a perfect mix of online flexibility and on-campus
              experience — 2 years online, 1 year on campus to get certified.
            </p>
            <div className="uyllist">
              <ul className="mt-8 space-y-4">
                {leftMenuItems.map((item, index) => (
                  <li key={index} className="flex items-center listulitems relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="imgIcons"
                      width="30"
                      height="30"
                    />
                    <a href={item.link}>{item.name}</a>
                  </li>
                ))}
              </ul>
              <button onClick={handleClick} className="border border-[#ffffff] bg-white text-[#0056d2] font-semibold rounded-full uppercase hover:bg-[#0056d2] hover:text-[#ffffff]">
                View All Courses
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1  flex flex-col justify-center items-end pl-[9vw] text-right text-[#333333] hbancol colRight">
            <h1 className="leading-snug text-[#0056D2]">
              <span>Find</span> Countries <span>for</span> <br />
              Medical <span>Programs</span>
            </h1>
            <p className="mt-6 font-medium">
              Study medical programs <span>On-campus</span> with real-time, hands-on learning,
              guided by expert faculty in globally recognized institutions.
            </p>
            <div className="uyllist pl-[5vw]">
              <ul className="mt-8 space-y-4">
                {rightMenuItems.map((item, index) => (
                  <li key={index} className="flex items-center listulitems relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="imgIcons"
                      width="30"
                      height="30"
                    />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
              <button onClick={ContactClick} className="border border-[#0056d2] bg-[#0056d2] text-white font-semibold rounded-full uppercase hover:text-[#0056d2] hover:bg-white">
                View All Medical Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EducationPromoSection
