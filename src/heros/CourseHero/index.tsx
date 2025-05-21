import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Course } from '@/payload-types'

import { Media } from '@/components/Media'

export const CourseHero: React.FC<{
  post: Course
}> = ({ post }) => {
  const {
    heroImage,
    publishedAt,
    title,
    university,
    degreeProgram,
    department,
    studyArea,
    studyYears,
    studyMode,
    intakeMonths,
    programmeAccreditationCode,
    pathway,
    assessments,
    description,
  } = post

  const universityLogo = university?.logo;

  return (
    <div className="relative -mt-[10.4rem] flex flex-col items-center pagebannersec">
      <div className="container z-10 relative text-white pb-8">
        {/* Course Header */}
        <div className="text-center">
          <h1 className="mb-2 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          {programmeAccreditationCode && (
            <p className="text-sm italic">{programmeAccreditationCode}</p>
          )}
        </div>

        {/* University */}
        {university && (
          <div className="mt-4 text-center">
            {universityLogo && typeof universityLogo !== 'string' && (
              <Media
                fill={false}
                priority
                imgClassName="mx-auto mb-2 h-16"
                resource={universityLogo}
              />
            )}
            <p>{university.title}</p>
          </div>
        )}

        {/* Course Description */}
        {description && (
          <div className="mt-4 text-center">
            <p className="text-lg">{description}</p>
          </div>
        )}

        {/* Additional Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {university && (
            <div className="text-center">
              <p className="text-sm uppercase">Awarded by</p>
              <p className="font-medium">{university.title}</p>
            </div>
          )}
          {studyYears && (
            <div className="text-center">
              <p className="text-sm uppercase">Duration</p>
              <p className="font-medium">{studyYears} years</p>
            </div>
          )}
          {pathway && (
            <div className="text-center">
              <p className="text-sm uppercase">Pathway</p>
              <p className="font-medium">{pathway}</p>
            </div>
          )}
          {studyMode && (
            <div className="text-center">
              <p className="text-sm uppercase">Study Mode</p>
              <p className="font-medium">{studyMode}</p>
            </div>
          )}
          {intakeMonths && (
            <div className="text-center">
              <p className="text-sm uppercase">Intakes</p>
              <p className="font-medium">{intakeMonths}</p>
            </div>
          )}
          {assessments && (
            <div className="text-center">
              <p className="text-sm uppercase">Assessments</p>
              <p className="font-medium">{assessments}</p>
            </div>
          )}
        </div>

        {/* Published Date */}
        {publishedAt && (
          <div className="mt-8 text-center">
            <p className="text-sm uppercase">Date Published</p>
            <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
          </div>
        )}
      </div>

      
      {/* Hero Image */}
      <div className="min-h-[60vh] select-none w-full relative">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}