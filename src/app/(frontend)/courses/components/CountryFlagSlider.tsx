"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Country {
  id: string;
  name: string;
  code: string;
  logo?: {
    url: string;
  };
}

const CountryFlagSlider = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries?limit=100');
        const data = await response.json();
        setCountries(data.docs);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const toggleCountry = (countryName: string) => {
    setSelectedCountries((prev) =>
      prev.includes(countryName)
        ? prev.filter((c) => c !== countryName)
        : [...prev, countryName]
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  if (loading) return <div className="flex justify-center w-full"><div className="w-96"></div></div>;

  return (
    <div className="flex justify-center w-full">
      <div className="w-96">
        <Slider {...settings}>
          {countries.map((country) => (
            <div key={country.id} className="px-4">
              <div
                className={`flex flex-col items-center cursor-pointer ${
                  selectedCountries.includes(country.name)
                    ? "text-blue-500 font-bold"
                    : "text-gray-800"
                }`}
                onClick={() => toggleCountry(country.name)}
              >
                {country.logo?.url ? (
                  <img 
                    src={country.logo.url} 
                    alt={country.name} 
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <span className="text-4xl">
                    {getFlagEmoji(country.code)}
                  </span>
                )}
                <span className="text-base mt-2">{country.name}</span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

// Helper function to get flag emoji from country code
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Custom Next Arrow
const SampleNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 cursor-pointer z-10"
      onClick={onClick}
    >
      &#8250;
    </div>
  );
};

// Custom Prev Arrow
const SamplePrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 cursor-pointer z-10"
      onClick={onClick}
    >
      &#8249;
    </div>
  );
};

export default CountryFlagSlider;
//final