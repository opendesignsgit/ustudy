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

interface CountryFlagSliderProps {
  selectedCountries: string[]
  onCountryToggle: (countryName: string) => void
}

const CountryFlagSlider: React.FC<CountryFlagSliderProps> = ({
  selectedCountries,
  onCountryToggle
}) => {
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

  const settings = {
    dots: false,
    arrows: countries.length > 6,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  }

  if (loading) {
    return (
      <div className="flex justify-center w-full py-8">
        <div className="container mx-auto">
          <Slider {...settings} className="flagSlider">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="px-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-4 w-20 mt-2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    )
  }

  return (
    <section className="flex justify-center w-full FlagListSec py-2">
      <div className="container mx-auto">
        <Slider {...settings} className="flagSlider">
          {countries.map((country) => (
            <div key={country.id} className="px-4">
              <div
                className={`countryitems flex flex-col items-center cursor-pointer transition-all ${selectedCountries.includes(country.name)
                  ? 'text-blue-500 font-bold'
                  : 'text-gray-800'
                  }`}
                onClick={() => onCountryToggle(country.name)}
              >
                <div className={`relative w-16 h-16 flex items-center justify-center rounded-full p-1 ${selectedCountries.includes(country.name)
                  ? 'ring-4 ring-white'
                  : 'ring-1 ring-gray-200'
                  }`}>
                  {country.logo?.url ? (
                    <img
                      src={country.logo.url}
                      alt={country.name}
                      className="w-14 h-14 object-contain rounded-full"
                    />
                  ) : (
                    <span className="text-3xl">{getFlagEmoji(country.code)}</span>
                  )}
                </div>
                <h5 className="text-base mt-2 text-center">{country.name}</h5>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export default CountryFlagSlider