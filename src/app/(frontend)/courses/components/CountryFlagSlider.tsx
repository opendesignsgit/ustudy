"use client";

import React, { useState } from "react";

const CountryFlagSlider = () => {
  // Explicitly define the type of selectedCountries as string[]
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const countries = [
    { name: "Malaysia", flag: "🇲🇾" },
    { name: "Barbados", flag: "🇧🇧" },
    { name: "Kazakhstan", flag: "🇰🇿" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "Kyrgyzstan", flag: "🇰🇬" },
    { name: "Tajikistan", flag: "🇹🇯" },
  ];

  const toggleCountry = (countryName: string) => {
    setSelectedCountries((prev) =>
      prev.includes(countryName)
        ? prev.filter((c) => c !== countryName)
        : [...prev, countryName]
    );
  };

  return (
    <div className="mb-4">
      <h3 className="font-medium mb-2">Countries</h3>
      <div className="flex overflow-x-auto gap-4 py-2">
        {countries.map((country) => (
          <div
            key={country.name}
            className={`flex flex-col items-center cursor-pointer ${
              selectedCountries.includes(country.name)
                ? "text-blue-500 font-bold"
                : "text-gray-700"
            }`}
            onClick={() => toggleCountry(country.name)}
          >
            <span className="text-3xl">{country.flag}</span>
            <span className="text-sm mt-1">{country.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryFlagSlider;
//final