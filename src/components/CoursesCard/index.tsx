'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'externalLink' | 'heroImage' | 'excerpt'> &
  { logo?: string; collegeName?: string } // Added fields for logo and collegeName

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
  const { slug, categories, meta, title, externalLink, heroImage: secondaryImage, excerpt, logo, collegeName } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // Replace non-breaking space with white space
  const sanitizedExcerpt = excerpt?.replace(/\s/g, ' ') // Replace non-breaking space with white space
  const href = externalLink ? externalLink : `/${relationTo}/${slug}`

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
        {logo && (
          <div className="absolute top-2 right-2">
            <img
              src={logo}
              alt="Institution Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
        )}

        {/* Left Section: Image */}
        <div className="relative w-1/4">
          {metaImage ? (
            <Media resource={metaImage} size="100%" />
          ) : secondaryImage !== null ? (
            <Media resource={secondaryImage} size="100%" />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">No image</div>
          )}
        </div>

        {/* Right Section: Content */}
        <div className="p-4 w-3/4">
          {/* College Name */}
          {collegeName && (
            <div className="text-sm font-semibold text-gray-700 mb-2">
              {collegeName}
            </div>
          )}

          {/* University Name / Categories */}
          {showCategories && hasCategories && (
            <div className="text-xs font-semibold text-blue-700 uppercase mb-2">
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
            </div>
          )}

          {/* Course Title */}
          {titleToUse && (
            <h3 className="text-lg font-bold mb-2">
              {externalLink ? (
                <a className="hover:underline" href={href} target="_blank" rel="noopener noreferrer">
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
          <div className="text-sm text-gray-600 mb-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <span className="material-icons text-blue-500">place</span>
              <span>Malaysia</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-icons text-blue-500">school</span>
              <span>Under Graduate</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-icons text-blue-500">schedule</span>
              <span>3 Years</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-icons text-blue-500">calendar_today</span>
              <span>Jan, May & Sep</span>
            </div>
          </div>

          {/* Excerpt */}
          {excerpt && <p className="text-sm text-gray-700 mb-4">{sanitizedExcerpt}</p>}

          {/* Explore More Button */}
          <div>
            <Link
              href={href}
              className="inline-block bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Explore More
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
//final