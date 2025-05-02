"use client"
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AcademicPathSlider: React.FC = () => {
  const settings = {
    dots: true,
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
  };

  const sections = [
    {
      title: "MEDIA",
      description: "Gain cutting-edge media skills and hands-on experience to innovate and...",
      image: "path-to-media-image.jpg",
    },
    {
      title: "LAW",
      description: "Studying law equips you with critical thinking, problem-solving, and advoca...",
      image: "path-to-law-image.jpg",
    },
    {
      title: "BUSINESS",
      description: "Master the art of leadership, strategy, and innovation with business program...",
      image: "path-to-business-image.jpg",
    },
    {
      title: "MEDICAL",
      description: "Pursue excellence in healthcare with in-depth medical education, hands-on...",
      image: "path-to-medical-image.jpg",
    },
  ];

  return (
    <div className="bg-blue-50 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-700">Discover Your Academic Path</h2>
        <p className="text-gray-600 mt-4">
          Explore diverse fields of study and find the perfect program that matches your passion and career goals,
          equipping you with the skills and knowledge to thrive in a competitive global landscape.
        </p>
      </div>
      <Slider {...settings} className="max-w-6xl mx-auto px-4">
        {sections.map((section, index) => (
          <div key={index} className="px-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
              <div
                className="h-64 bg-cover bg-center transition-transform transform hover:scale-105"
                style={{ backgroundImage: `url(${section.image})` }}
              >
                <div className="bg-blue-700 text-white text-lg font-semibold px-4 py-2 inline-block rounded-br-lg">
                  {section.title}
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-700">{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const SampleNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-700 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-800"
      aria-label="Next Slide"
    >
      →
    </button>
  );
};

const SamplePrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-700 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-800"
      aria-label="Previous Slide"
    >
      ←
    </button>
  );
};

export default AcademicPathSlider;