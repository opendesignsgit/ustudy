// 'use client'
// import { cn } from '@/utilities/cn'
// import useClickableCard from '@/utilities/useClickableCard'
// import Link from 'next/link'
// import React, { Fragment } from 'react'

// import type { Post } from '@/payload-types'

// import { Media } from '@/components/Media'

// export type CardPostData = Pick<
//   Post,
//   'slug' | 'categories' | 'meta' | 'title' | 'externalLink' | 'heroImage' | 'excerpt' | 'university'
// > & { logo?: string; collegeName?: string } // Added fields for logo and collegeName

// export const CoursesCard: React.FC<{
//   alignItems?: 'center'
//   className?: string
//   doc?: CardPostData
//   relationTo?: string
//   showCategories?: boolean
//   title?: string
// }> = (props) => {
//   const { card, link } = useClickableCard({})

//   const { className, doc, showCategories, title: titleFromProps } = props
//   const relationTo = props.relationTo ?? 'posts'
//   const {
//     slug,
//     categories,
//     meta,
//     title,
//     externalLink,
//     heroImage: secondaryImage,
//     excerpt,
//     university,
//   } = doc || {}
//   const { description, image: metaImage } = meta || {}

//   const hasCategories = categories && Array.isArray(categories) && categories.length > 0
//   const titleToUse = titleFromProps || title
//   const sanitizedDescription = description?.replace(/\s/g, ' ')
//   const sanitizedExcerpt = excerpt?.replace(/\s/g, ' ')
//   const href = externalLink ? externalLink : `/${relationTo}/${slug}`
//   const logoUrl = university?.logo?.url // Get the logo URL from university
//   const universityTitle = university?.title // Get the logo URL from university

//   return (
//     <article className={cn(className)} ref={card.ref}>
//       <div className="flex relative">
//         {/* Logo in the top-right corner */}
//         {logoUrl && (
//           <div className="absolute top-2 right-2 z-10 Universitylogo">
//             <Image
//               src={logoUrl}
//               alt={`${university?.title || 'University'} logo`}
//               className="h-10 w-auto object-contain bg-white p-1 rounded"
//             />
//           </div>
//         )}

//         {/* Left Section: Image */}
//         <div className="relative w-1/4 courseimgbox">
//           {metaImage ? (
//             <Media resource={metaImage} size="100%" />
//           ) : secondaryImage !== null ? (
//             <Media resource={secondaryImage} size="100%" />
//           ) : (
//             <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//               No image
//             </div>
//           )}
//         </div>

//         {/* Right Section: Content */}
//         <div className="w-3/4 courseContbox">
//           {/* College Name */}
//           {universityTitle && <h5>{universityTitle}</h5>}

//           {/* University Name / Categories */}
//           {showCategories && hasCategories && (
//             <h5 className="">
//               {categories?.map((category, index) => {
//                 if (typeof category === 'object') {
//                   const { title: titleFromCategory } = category
//                   const categoryTitle = titleFromCategory || 'Untitled category'
//                   const isLast = index === categories.length - 1

//                   return (
//                     <Fragment key={index}>
//                       {categoryTitle}
//                       {!isLast && <Fragment>, &nbsp;</Fragment>}
//                     </Fragment>
//                   )
//                 }
//                 return null
//               })}
//             </h5>
//           )}

//           {/* Course Title */}
//           {titleToUse && (
//             <h3 className="text-lg font-bold mb-2">
//               {externalLink ? (
//                 <a
//                   className="hover:underline"
//                   href={href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {titleToUse}
//                 </a>
//               ) : (
//                 <Link className="hover:underline" href={href} ref={link.ref}>
//                   {titleToUse}
//                 </Link>
//               )}
//             </h3>
//           )}

//           {/* Course Details */}
//           <div className="cousindetlcol text-sm text-gray-600 mb-4 flex flex-wrap gap-2">
//             <div className="flex items-center gap-1">
//               <span className="material-icons place text-blue-500"></span>
//               <span>Malaysia</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="material-icons school text-blue-500"></span>
//               <span>Under Graduate</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="material-icons schedule text-blue-500"></span>
//               <span>3 Years</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="material-icons intake text-blue-500"></span>
//               <span>Jan, May & Sep</span>
//             </div>
//           </div>

//           {/* Excerpt */}
//           {excerpt && <p className="text-sm text-gray-700 mb-4">{sanitizedExcerpt}</p>}

//           {/* Explore More Button */}
//           <div className="flex">
//             <Link href={href} className="expolrlink">
//               Explore More
//             </Link>
//           </div>
//         </div>
//       </div>
//     </article>
//   )
// }
// //final
