"use client"
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const destinations = [
  {
    name: "MALAYSIA",
    image: "https://example.com/malaysia.jpg", // Replace with actual image URL
  },
  {
    name: "BARBADOS",
    image: "https://example.com/barbados.jpg", // Replace with actual image URL
  },
  {
    name: "KAZAKHSTAN",
    image: "https://example.com/kazakhstan.jpg", // Replace with actual image URL
  },
];

const StudyDestinationCarousel: React.FC = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
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
  };

  return (
    <div className="py-16 bg-white">
      <h1 className="text-4xl font-bold text-center text-blue-700">
        Find Your Perfect Study Destination
      </h1>
      <p className="text-center text-gray-500 mt-4">
        Explore top universities and courses worldwide. Choose the best place to
        shape your future and achieve your dreams!
      </p>
      <div className="mt-10">
        <Slider {...settings}>
          {destinations.map((destination, index) => (
            <div key={index} className="px-2">
              <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  className="w-full h-64 object-cover"
                  src={destination.image}
                  alt={destination.name}
                />
                <div className="absolute top-4 left-4 bg-blue-700 text-white py-1 px-3 rounded-lg">
                  {destination.name}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

const SampleNextArrow: React.FC<any> = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg"
      onClick={onClick}
    >
      <i className="fas fa-arrow-right"></i>
    </div>
  );
};

const SamplePrevArrow: React.FC<any> = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg"
      onClick={onClick}
    >
      <i className="fas fa-arrow-left"></i>
    </div>
  );
};

export default StudyDestinationCarousel;