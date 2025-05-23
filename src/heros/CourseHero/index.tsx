import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Course } from '@/payload-types'

import { Media } from '@/components/Media'
import Image from 'next/image'

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

  const universityLogo = university?.logo

  return (
    <div className="relative cdpagebansec">
      <div className="relative cdbaninrowbox">
        <div className="w-full h-full relative cdbanimgbox">
          {heroImage && typeof heroImage !== 'string' && (
            <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
          )}
        </div>
        <div className="cdbanContBox absolute w-full h-full top-0 left-0">
          <div className="container relative h-full flex items-center justify-center">
            {/* Course Header */}
            <div className="cdbaninCont text-center">
              <h1>{title}</h1>
              {programmeAccreditationCode && <h4>{programmeAccreditationCode}</h4>}

              {/* University */}
              {university && (
                <div className="collogos">
                  {universityLogo && typeof universityLogo !== 'string' && (
                    <Media fill={false} priority imgClassName="mx-auto" resource={universityLogo} />
                  )}
                  <h5>{university.title}</h5>
                </div>
              )}

              {/* Course Description */}
              {description && <p className="description">{description}</p>}
            </div>

            {/* Additional Meta Information */}
          </div>
        </div>
      </div>
      <div className="courmetadatabox relative">
        <div className="container">
          <div className="flex items-center justify-center">
            <div className="cmetsitemsbox flex items-center justify-center">
              {university && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-awardby.png"
                      alt="Awarded"
                      width="60"
                      height="60"
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Awarded by</h5>
                    <p>{university.title}</p>
                  </div>
                </div>
              )}
              {studyYears && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-duration.png"
                      alt="Duration"
                      width="60"
                      height="60"
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Duration</h5>
                    <p>{studyYears} years</p>
                  </div>
                </div>
              )}
              {pathway && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-pathway.png"
                      alt="Pathway"
                      width="60"
                      height="60"
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Pathway</h5>
                    <p>{pathway}</p>
                  </div>
                </div>
              )}
              {studyMode && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-studymode.png"
                      alt="Study Mode"
                      width="60"
                      height="60"
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Study Mode</h5>
                    <p>{studyMode}</p>
                  </div>
                </div>
              )}
              {intakeMonths && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-intakes.png"
                      alt="Intakes"
                      width="60"
                      height="60"
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Intakes</h5>
                    <p>{intakeMonths}</p>
                  </div>
                </div>
              )}
              {assessments && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-assessments.png"
                      alt="Assessments"
                      width="60"
                      height="60"
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Assessments</h5>
                    <p>{assessments}</p>
                  </div>
                </div>
              )}
              {/* Published Date */}
              {/* {publishedAt && (
            <div className="cmetsitems">
              <p className="text-sm uppercase">Date Published</p>
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </div>
          )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
    </div>
  )
}
