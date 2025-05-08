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

const EducationPromoSection = () => {
  const leftMenuItems = [
    { name: 'Business', icon: faBriefcase, bgColor: 'bg-purple-400' },
    { name: 'Law', icon: faGavel, bgColor: 'bg-orange-400' },
    { name: 'Media', icon: faFilm, bgColor: 'bg-green-400' },
    { name: 'Digital Technology', icon: faLaptopCode, bgColor: 'bg-pink-400' },
  ]

  const rightMenuItems = [
    { name: 'Kazakhstan', icon: faGlobe, bgColor: 'bg-green-400' },
    { name: 'Barbados', icon: faGlobe, bgColor: 'bg-yellow-400' },
    { name: 'Kyrgyzstan', icon: faGlobe, bgColor: 'bg-red-400' },
    { name: 'Tajikistan', icon: faGlobe, bgColor: 'bg-orange-400' },
  ]

  return (
    <section className="relative w-full h-screen hbanersec  relative">
      {/* Left Section */}
      <div className="container relative h-full z-10">
        <div className="flex flex-col md:flex-row relative  h-full">
          <div className="flex-1 text-white flex flex-col justify-center items-start relative  pr-[9vw] colLeft">
            <h1 className="leading-snug">
              Earn <span>While</span> <br />
              <span>you Learn</span> Online
            </h1>
            <p className="mt-6  font-medium">
              Learn anytime, anywhere with a perfect mix of online flexibility and on-campus
              experience — 2 years online, 1 year on campus.
            </p>
            <div className="uyllist">
              <ul className="mt-8 space-y-4">
                {leftMenuItems.map((item, index) => (
                  <li key={index} className="flex items-center listulitems relative">
                    <span className={`${item.bgColor} rounded-full listicon`}>
                      <FontAwesomeIcon icon={item.icon} className="text-white w-6 h-6" />
                    </span>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-10 px-6 py-3 bg-white text-blue-900 font-semibold rounded-full">
                View All Courses
              </button>
            </div>
          </div>

          {/* Center Image */}
          <div className="absolute bottom-0 left-[50%] -translate-x-[50%] flex justify-center items-end pointer-events-none w-[48%]">
            <img
              src="/media/home/hban-girl-img.png" // Replace with the actual path to the image
              alt="Student"
              className="w-full h-auto object-cover z-10"
            />
          </div>

          {/* Right Section */}
          <div className="flex-1  flex flex-col justify-center items-end pl-[9vw] text-right text-[#333333] colRight">
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
                    <span className={`${item.bgColor} rounded-full listicon`}>
                      <FontAwesomeIcon icon={item.icon} className="text-white w-6 h-6" />
                    </span>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-10 px-6 py-3 bg-blue-900 text-white font-semibold rounded-full">
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
