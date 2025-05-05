import { cn } from 'src/utilities/cn'
import React from 'react'

import type { Post } from '@/payload-types'

import { CoursesCard, CardPostData } from '@/components/CoursesCard'

export type Props = {
  posts: CardPostData[]
  relationTo?: string
  customClass?: string
  numberOfCol?: number
}

export const CollectionArchiveCourses: React.FC<Props> = (props) => {
  const { posts, relationTo = 'posts', customClass, numberOfCol } = props

  return (
    <div className={cn('container', customClass)}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className={`col-span-12`} key={index}>
                  <CoursesCard className="h-full" doc={result} relationTo={relationTo} showCategories />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
//final