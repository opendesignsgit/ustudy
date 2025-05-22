// components/YearlyCourses.tsx
import React from 'react'
import RichText from '@/components/RichText'
import type { YearlyCoursesBlock as YearlyCoursesBlockProps } from '@/payload-types'

export const YearlyCoursesBlock: React.FC<YearlyCoursesBlockProps> = (props) => {
  const { years } = props

  return (
    <div className="yearly-courses-container">
      <div className="CourseModuleTitle">
        <h2>Course Modules</h2>
      </div>
      <div className="yearModulebox">
        {years?.map((year, yearIndex) => (
          <div key={yearIndex} className="year-group">
            <div className="yearintitle">
              <h4>{year.yearNumber}</h4>
            </div>

            <div className="flex ">
              <div className="left-column">
                <RichText data={year.leftColumn} />
              </div>
              <div className="right-column">
                <RichText data={year.rightColumn} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
