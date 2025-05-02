"use client"
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faGavel, faFilm, faLaptopCode, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const EducationPromoSection = () => {
  const [hoveredLeft, setHoveredLeft] = useState<number | null>(null);
  const [hoveredRight, setHoveredRight] = useState<number | null>(null);

  const leftMenuItems = [
    { name: 'Business', icon: faBriefcase, bgColor: 'bg-purple-400' },
    { name: 'Law', icon: faGavel, bgColor: 'bg-orange-400' },
    { name: 'Media', icon: faFilm, bgColor: 'bg-green-400' },
    { name: 'Digital Technology', icon: faLaptopCode, bgColor: 'bg-pink-400' },
  ];

  const rightMenuItems = [
    { name: 'Kazakhstan', icon: faGlobe, bgColor: 'bg-green-400' },
    { name: 'Barbados', icon: faGlobe, bgColor: 'bg-yellow-400' },
    { name: 'Kyrgyzstan', icon: faGlobe, bgColor: 'bg-red-400' },
    { name: 'Tajikistan', icon: faGlobe, bgColor: 'bg-orange-400' },
  ];

  return (
    <div className="relative flex flex-col md:flex-row w-full h-screen">
      {/* Left Section */}
      <div className="flex-1 bg-blue-900 text-white flex flex-col justify-center items-start p-10 relative">
        <h1 className="text-4xl md:text-5xl font-bold leading-snug">
          Earn While <br />
          <span className="font-light italic">you</span> Learn Online
        </h1>
        <p className="mt-6 text-lg">
          Learn anytime, anywhere with a perfect mix of online flexibility and on-campus experience —{' '}
          <strong>2 years online, 1 year on campus.</strong>
        </p>
        <div className="mt-8 space-y-4">
          {leftMenuItems.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredLeft(index)}
              onMouseLeave={() => setHoveredLeft(null)}
              className="flex items-center space-x-4 relative"
            >
              <span className={`${item.bgColor} p-2 rounded-full`}>
                <FontAwesomeIcon icon={item.icon} className="text-white w-6 h-6" />
              </span>
              <span>{item.name}</span>
              {hoveredLeft === index && (
                <span className="absolute top-1/2 transform -translate-y-1/2 right-0 text-white font-bold">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              )}
            </div>
          ))}
        </div>
        <button className="mt-10 px-6 py-3 bg-white text-blue-900 font-semibold rounded-full">
          View All Courses
        </button>
      </div>

      {/* Center Image */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <img
          src="girl-image.png" // Replace with the actual path to the image
          alt="Student"
          className="w-72 h-auto object-cover z-10"
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-white text-blue-900 flex flex-col justify-center items-start p-10">
        <h1 className="text-4xl md:text-5xl font-bold leading-snug">
          Find Countries for <br />
          Medical Programs
        </h1>
        <p className="mt-6 text-lg">
          Study medical programs <strong>On-campus</strong> with real-time, hands-on learning, guided by expert faculty
          in globally recognized institutions.
        </p>
        <div className="mt-8 space-y-4">
          {rightMenuItems.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredRight(index)}
              onMouseLeave={() => setHoveredRight(null)}
              className="flex items-center space-x-4 relative"
            >
              <span className={`${item.bgColor} p-2 rounded-full`}>
                <FontAwesomeIcon icon={item.icon} className="text-white w-6 h-6" />
              </span>
              <span>{item.name}</span>
              {hoveredRight === index && (
                <span className="absolute top-1/2 transform -translate-y-1/2 right-0 text-blue-900 font-bold">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              )}
            </div>
          ))}
        </div>
        <button className="mt-10 px-6 py-3 bg-blue-900 text-white font-semibold rounded-full">
          View All Medical Courses
        </button>
      </div>
    </div>
  );
};

export default EducationPromoSection;