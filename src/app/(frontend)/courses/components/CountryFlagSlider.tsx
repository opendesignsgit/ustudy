'use client'

import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'

interface Country {
  id: string
  name: string
  code: string
  logo?: {
    url: string
  }
}

const CountryFlagSlider = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries?limit=100')
        const data = await response.json()
        setCountries(data.docs)
      } catch (error) {
        console.error('Error fetching countries:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const toggleCountry = (countryName: string) => {
    setSelectedCountries((prev) =>
      prev.includes(countryName) ? prev.filter((c) => c !== countryName) : [...prev, countryName],
    )
  }

  const settings = {
    dots: false,
    arrow: countries.length > 6,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
  }

  if (loading)
    return (
      <div className="flex justify-center w-full">
        <div className="w-96"></div>
      </div>
    )

  return (
    <section className="flex justify-center w-full FlagListSec ">
      <div className="container mx-auto">
        <Slider {...settings} className="flagSlider">
          {countries.map((country) => (
            <div key={country.id} className="px-4">
              <div
                className={`countryitems flex flex-col items-center cursor-pointer ${
                  selectedCountries.includes(country.name)
                    ? 'text-blue-500 font-bold'
                    : 'text-gray-800'
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
                  <span>{getFlagEmoji(country.code)}</span>
                )}
                <h5 className="text-base mt-2">{country.name}</h5>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}

// Helper function to get flag emoji from country code
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export default CountryFlagSlider
//final
