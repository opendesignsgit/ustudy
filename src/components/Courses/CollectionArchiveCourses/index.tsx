import { cn } from 'src/utilities/cn'
import React from 'react'

import type { Course } from '@/payload-types'

import { CoursesCard, CardPostData } from '@/components/Courses/CoursesCard'

export type Props = {
  courses: CardPostData[]
  relationTo?: string
  customClass?: string
  numberOfCol?: number
}

export const CollectionArchiveCourses: React.FC<Props> = (props) => {
  const { courses, relationTo = 'courses', customClass, numberOfCol } = props

  return (
    <div className={cn('coursListBox', customClass)}>
      <div>
        <div className="flex flex-wrap clboxssview">
          {courses?.map((result, index) => {
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
