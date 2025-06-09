'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'
import Image from 'next/image'

import type { Course } from '@/payload-types'

import { Media } from '@/components/Media'

type University = {
  logo?: {
    url: string;
  };
  title?: string;
  country?: {
    name: string;
  };
};

export type CardPostData = Pick<
  Course,
  | 'title'
  | 'slug'
  | 'description'
  | 'heroImage'
  | 'university'
  | 'degreeProgram'
  | 'department'
  | 'studyArea'
  | 'studyYear'
  | 'studyMode'
  | 'intakeMonths'
  | 'meta'
> & {
  categories?: Array<{ title?: string }>
  externalLink?: string
  excerpt?: string
  logo?: string
  collegeName?: string
  University?: University
}

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

export const CoursesCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: string
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, showCategories, title: titleFromProps } = props
  const relationTo = props.relationTo ?? 'posts'
  const {
    slug,
    categories,
    meta,
    title,
    externalLink,
    heroImage: secondaryImage,
    excerpt,
    university,
    degreeProgram,
    department,
    studyArea,
    studyYear,
    studyMode,
    intakeMonths,
    description,
  } = doc || {}

  const { image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedExcerpt = excerpt?.replace(/\s/g, ' ')
  const href = externalLink ? externalLink : `/${relationTo}/${slug}`
  const logoUrl = (university as any)?.logo?.url;
  const universityTitle = (university as any)?.title
  const countryName = (university as any)?.country?.name || 'Malaysia'

  // Relationship display values
  const degreeProgramLabel = getRelationshipLabel(degreeProgram);
  const departmentLabel = getRelationshipLabel(department);
  const studyAreaLabel = getRelationshipLabel(studyArea);
  const studyModeLabel = getRelationshipLabel(studyMode);

  // Intake months (hasMany)
  const intakeMonthsLabels = Array.isArray(intakeMonths)
    ? intakeMonths.map(getRelationshipLabel).filter(Boolean)
    : [getRelationshipLabel(intakeMonths)].filter(Boolean);

  // Study Year display (show raw value/label directly)
  const studyYearsDisplay = getRelationshipLabel(studyYear);

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300',
        className,
      )}
      ref={card.ref}
    >
      <div className="flex relative">
        {/* Logo in the top-right corner */}
        {logoUrl && (
          <div className="absolute top-2 right-2 z-10 Universitylogo">
            <img
              src={logoUrl}
              alt={`${universityTitle || 'University'} logo`}
              className="h-10 w-auto object-contain bg-white p-1 rounded"
            />
          </div>
        )}

        {/* Left Section: Image */}
        <div className="relative w-1/4 courseimgbox">
          {metaImage ? (
            <Media resource={metaImage} size="100%" />
          ) : secondaryImage !== null ? (
            <Media resource={secondaryImage} size="100%" />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
              No image
            </div>
          )}
        </div>

        {/* Right Section: Content */}
        <div className="p-4 w-3/4 courseContbox">
          {/* College Name */}
          {universityTitle && <h5>{universityTitle}</h5>}

          {/* University Name / Categories */}
          {showCategories && hasCategories && (
            <h5>
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category
                  const categoryTitle = titleFromCategory || 'Untitled category'
                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                }
                return null
              })}
            </h5>
          )}

          {/* Course Title */}
          {titleToUse && (
            <h3 className="text-lg font-bold mb-2">
              {externalLink ? (
                <a
                  className="hover:underline"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {titleToUse}
                </a>
              ) : (
                <Link className="hover:underline" href={href} ref={link.ref}>
                  {titleToUse}
                </Link>
              )}
            </h3>
          )}

          {/* Course Details */}
          <div className="cousindetlcol text-sm text-gray-600 mb-4 flex flex-wrap gap-5">
            <div className="flex items-center gap-1">
              <img src="/media/coursesicons/courses-map-pin.svg" alt="" />
              <span>{countryName}</span>
            </div>
            {degreeProgramLabel && (
              <div className="flex items-center gap-1">
                <img src="/media/coursesicons/courses-graduation-cap.svg" alt="" />
                <span>{degreeProgramLabel}</span>
              </div>
            )}
            {studyYearsDisplay && (
              <div className="flex items-center gap-1">
                <img src="/media/coursesicons/courses-clock-time.svg" alt="" />
                <span>{studyYearsDisplay}</span>
              </div>
            )}
            {studyModeLabel && (
              <div className="flex items-center gap-1">
                <img src="/media/coursesicons/courses-on-off-line.svg" alt="" />
                <span>{studyModeLabel}</span>
              </div>
            )}
            {intakeMonthsLabels.length > 0 && (
              <div className="flex items-center gap-1">
                <img src="/media/coursesicons/courses-date.svg" alt="" />
                <span>{intakeMonthsLabels.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Description or Excerpt */}
          <div className="descriptbox">
            {(description || sanitizedExcerpt) && (
              <p className="text-sm mb-4">{description || sanitizedExcerpt}</p>
            )}
          </div>

          {/* Explore More Button */}
          <div className="flex">
            <Link href={href} className="expolrlink">
              Explore More
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
// Final