import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Course } from '@/payload-types'

import { Media } from '@/components/Media'
import Image from 'next/image'

// Helper to safely extract a display label from a relationship field
// Helper to safely extract a display label from a relationship field
export function getRelationshipLabel<T extends { title?: string | null; name?: string | null }>(
  value: T | string | number | undefined | null
): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if ('title' in value && typeof value.title === 'string' && value.title.trim()) return value.title;
  if ('name' in value && typeof value.name === 'string' && value.name.trim()) return value.name;
  return undefined;
}

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
    studyYear,
    studyMode,
    intakeMonths,
    programmeAccreditationCode,
    pathway,
    assessments,
    description,
  } = post

  // University logo and title safe extraction
  const universityLogo =
    university && typeof university === 'object' && 'logo' in university && university.logo && typeof university.logo !== 'string'
      ? university.logo
      : undefined
  const universityTitle = university ? getRelationshipLabel(university) : undefined

  // Study year
  const studyYearValue = typeof studyYear === 'number'
    ? studyYear
    : Number(getRelationshipLabel(studyYear))
  const studyYearDisplay = studyYearValue ? `${studyYearValue} year${studyYearValue > 1 ? 's' : ''}` : undefined

  // Study mode
  const studyModeLabel = getRelationshipLabel(studyMode)

  // Intake months (hasMany)
  const intakeMonthsLabels = Array.isArray(intakeMonths)
    ? intakeMonths.map(getRelationshipLabel).filter(Boolean)
    : [getRelationshipLabel(intakeMonths)].filter(Boolean)

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
              {universityTitle && (
                <div className="collogos">
                  {universityLogo && (
                    <Media fill={false} priority imgClassName="mx-auto" resource={universityLogo} />
                  )}
                  <h5>{universityTitle}</h5>
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
              {universityTitle && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-awardby.png"
                      alt="Awarded"
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Awarded by</h5>
                    <p>{universityTitle}</p>
                  </div>
                </div>
              )}
              {studyYearDisplay && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-duration.png"
                      alt="Duration"
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Duration</h5>
                    <p>{studyYearDisplay}</p>
                  </div>
                </div>
              )}
              {pathway && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-pathway.png"
                      alt="Pathway"
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Pathway</h5>
                    <p>{pathway}</p>
                  </div>
                </div>
              )}
              {studyModeLabel && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-studymode.png"
                      alt="Study Mode"
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Study Mode</h5>
                    <p>{studyModeLabel}</p>
                  </div>
                </div>
              )}
              {intakeMonthsLabels.length > 0 && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-intakes.png"
                      alt="Intakes"
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="cmitemscont">
                    <h5>Intakes</h5>
                    <p>{intakeMonthsLabels.join(', ')}</p>
                  </div>
                </div>
              )}
              {assessments && (
                <div className="cmetsitems flex items-center">
                  <div className="cmitemsimg">
                    <Image
                      src="/media/coursedetails/cd-icon-assessments.png"
                      alt="Assessments"
                      width={60}
                      height={60}
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
//Final