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
    <div className={cn('coursListBox', customClass)}>
      <div>
        <div className="flex flex-wrap clboxssview">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="flex-full clboxItemview" key={index}>
                  <CoursesCard doc={result} relationTo={relationTo} showCategories />
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
