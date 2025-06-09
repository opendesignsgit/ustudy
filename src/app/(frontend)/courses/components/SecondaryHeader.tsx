"use client";
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import clsx from 'clsx'

type StudyArea = {
  id: string | number;
  name: string;
  slug?: string;
}

type University = {
  name: string;
  title: string;
  slug: string;
}

export const SecondaryHeader = ({
  studyAreas,
  university,
  departments,
  logo
}: {
  studyAreas: StudyArea[];
  university?: University;
  departments?: StudyArea[];
  logo?: string | null;
}) => {
  const [startIdx, setStartIdx] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | "">("")

  const maxVisible = 6


  const encodeParam = (str: string) =>
    encodeURIComponent(str).replace(/%20/g, '+')

  const universityName = university?.title || ''

  const onPrev = () => {
    if (startIdx > 0) {
      setDirection("left")
      setStartIdx(idx => idx - 1)
      setTimeout(() => setDirection(""), 300)
    }
  }
  const onNext = () => {
    if (startIdx < studyAreas.length - maxVisible) {
      setDirection("right")
      setStartIdx(idx => idx + 1)
      setTimeout(() => setDirection(""), 300)
    }
  }
  const visibleAreas = studyAreas.slice(startIdx, startIdx + maxVisible)

  // Arrow SVGs
  const LeftArrow = (
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  )
  const RightArrow = (
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
  )

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* University logo */}
          <div className="colgelogo">
            {logo ? (
              <Link
                href={
                  universityName
                    ? `/courses?universities=${encodeParam(universityName)}`
                    : "/courses"
                }
              >
                <Image
                  src={logo}
                  alt="University Logo"
                  width={120}
                  height={40}
                  className="h-10 object-contain"
                  priority
                />
              </Link>
            ) : (
              <span className="text-xl font-bold"></span>
            )}
          </div>

          {/* Navigation: menu right-aligned */}
          <nav className="flex-1 flex justify-end items-center">
            {studyAreas.length > maxVisible && (
              <button
                onClick={onPrev}
                disabled={startIdx === 0}
                className="px-2 py-1 text-gray-500 disabled:text-gray-300"
                aria-label="Previous"
              >
                {LeftArrow}
              </button>
            )}

            <div
              className={clsx(
                "overflow-hidden w-fit",
                "relative"
              )}
              style={{ minWidth: `${maxVisible * 120}px` }}
            >
              <ul
                className={clsx(
                  "flex space-x-6 transition-transform duration-300",
                  {
                    "animate-slide-left": direction === "left",
                    "animate-slide-right": direction === "right"
                  }
                )}
                style={{ minWidth: `${maxVisible * 120}px` }}
              >
                {visibleAreas.map((area) => {
                  let url = '/courses?'
                  if (universityName) {
                    url += `universities=${encodeParam(universityName)}&`
                  }
                  url += `studyAreas=${encodeParam(area.name)}`

                  return (
                    <li key={area.id}>
                      <Link
                        href={url}
                        className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
                      >
                        {area.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {studyAreas.length > maxVisible && (
              <button
                onClick={onNext}
                disabled={startIdx >= studyAreas.length - maxVisible}
                className="px-2 py-1 text-gray-500 disabled:text-gray-300"
                aria-label="Next"
              >
                {RightArrow}
              </button>
            )}
          </nav>
        </div>
      </div>
      {/* Animation classes */}
      <style jsx global>{`
        @keyframes slideLeft {
          0% { transform: translateX(-40px); opacity: 0.6;}
          100% { transform: translateX(0); opacity: 1;}
        }
        @keyframes slideRight {
          0% { transform: translateX(40px); opacity: 0.6;}
          100% { transform: translateX(0); opacity: 1;}
        }
        .animate-slide-left {
          animation: slideLeft 0.3s;
        }
        .animate-slide-right {
          animation: slideRight 0.3s;
        }
      `}</style>
    </header>
  )
}