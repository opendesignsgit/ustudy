"use client";

import React, { useState } from "react";

const CountriesFilter = () => {
  // Explicitly define the type of the state as string[]
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const countries = [
    "Malaysia",
    "Barbados",
    "Kazakhstan",
    "Singapore",
    "Kyrgyzstan",
    "Tajikistan",
  ];

  const toggleCountry = (countryName: string) => {
    setSelectedCountries((prev) =>
      prev.includes(countryName)
        ? prev.filter((c) => c !== countryName) // Removing from the list
        : [...prev, countryName] // Adding to the list
    );
  };

  return (
    <div>
      <h3 className="font-medium mb-2">Countries</h3>
      <div className="space-y-2">
        {countries.map((country) => (
          <div key={country}>
            <input
              type="checkbox"
              id={country}
              value={country}
              onChange={() => toggleCountry(country)}
              checked={selectedCountries.includes(country)}
            />
            <label htmlFor={country} className="ml-2">
              {country}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountriesFilter;

//final