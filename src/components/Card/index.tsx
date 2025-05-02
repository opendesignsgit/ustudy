'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'externalLink' | 'heroImage' | 'excerpt'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: string
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, showCategories, title: titleFromProps } = props
  const relationTo = props.relationTo ?? 'posts';
  const { slug, categories, meta, title, externalLink, heroImage: secondaryImage, excerpt,  } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const sanitizedExcerpt = excerpt?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = externalLink ? externalLink : `/${relationTo}/${slug}`

  // const datefrom = new Date(eventfrom);
  // const dayfrom = datefrom.getDate().toString().padStart(2, '0');
  // const monthfrom = datefrom.toLocaleString('default', { month: 'short' });
  // const yearfrom = datefrom.getFullYear();
  // const dateto = new Date(eventto);
  // const dayto= dateto.getDate().toString().padStart(2, '0');
  // const monthto = datefrom.toLocaleString('default', { month: 'short' });
  // const yearto = datefrom.getFullYear(); 
  return (
    
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
      data-attr="kr"
    >
      
      {/* <div className="absolute  text-[18px] w-[fit-content] text-[rgb(253,_184,_19)] font-medium bg-[rgb(26,_26,_26)] pl-0 h-[80px] leading-[41.4px] pr-[20px] z-10 grid [box-shadow:rgba(0,_0,_0,_0.5)_11px_14px_13px_0px] m-0 text-center tracking-[-0.16px] font-[Biennale,_sans-serif]">
         <div className="text-[18px] w-[fit-content] text-[rgb(253,184,19)] font-medium bg-[rgb(26,26,26)] pl-[14px] h-[80px] leading-[2.3] z-10 grid mx-[5px] my-0 [text-shadow:rgb(0,0,0) 0px -2px 0px]">
          <span className="[grid-area:evd] text-[43.2px] font-bold place-self-center px-[10px] py-0 leading-none">{dayfrom}</span>
          <span className="[grid-area:evm] leading-[1.1]">{monthfrom}</span>
          <span className="[grid-area:evy] leading-[1.2]">{yearfrom}</span>
        </div>
        <div className="absolute top-2/4 left-2/4 m-0 pl-[2px] pr-0 py-0 h-1/2 leading-[0] text-center -translate-x-1/2"> - </div>
        <div className="text-[18px] w-[fit-content] text-[rgb(253,_184,_19)] font-medium bg-[rgb(26,_26,_26)] pl-[14px] h-[80px] leading-[2.3] z-10 grid mx-[5px] my-0 [text-shadow:rgb(0,_0,_0)_0px_-2px_0px]">
          <span className="[grid-area:evd] text-[43.2px] font-bold place-self-center px-[10px] py-0 leading-none">{dayto}</span>
          <span className="[grid-area:evm] leading-[1.1]">{monthto}</span>
          <span className="[grid-area:evy] leading-[1.2]">{yearto}</span>
        </div>
      </div> */}


      <div className="relative w-full ">
        {/* {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />} */}
        {metaImage ? (
          <Media resource={metaImage} size="33vw" />
        ) : secondaryImage !== null ? (
          <Media resource={secondaryImage} size="33vw" />
        ) : (
          <div className="">No image</div>
        )}
      </div>
      <div className="p-4">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-4">
            {showCategories && hasCategories && (
              <div>
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
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              {externalLink ? (
                <a className="not-prose" href={href} target="_blank" rel="noopener noreferrer">
                  {titleToUse}
                </a>
              ) : (
                <Link className="not-prose" href={href} ref={link.ref}>
                  {titleToUse}
                </Link>
              )}
            </h3>
          </div>
        )}
        {/* {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>} */}
        {excerpt && <div className="mt-2">{excerpt && <p>{sanitizedExcerpt}</p>}</div>}
      </div>
    </article>
  )
}