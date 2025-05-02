import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns, customcontainerclass, backgroundimage } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    oneFourth: '3',
    twoThirds: '8',
  }

  return (
    <div className={cn(customcontainerclass)}>
      <div className={cn('container')} style={{
          ...(backgroundimage && typeof backgroundimage === 'object' && {
            backgroundImage: `url(${backgroundimage.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
          }),
        }}>
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
          {columns &&
            columns.length > 0 &&
            columns.map((col, index) => {
              const { enableLink, link, richText, size, customclass, colbackgroundimage } = col

              return (
                <div
                  className={cn(
                    `col-span-4 lg:col-span-${colsSpanClasses[size!]}`,
                    customclass, // add a custom class to each block
                    {
                      'md:col-span-2': size !== 'full',
                    }
                  )}
                  key={index}
                  style={{
                    ...(colbackgroundimage && typeof colbackgroundimage === 'object' && {
                      backgroundImage: `url(${colbackgroundimage.url})`,
                    }),
                  }}
                >
                  {richText && <RichText data={richText} enableGutter={true} />}

                  {enableLink && <CMSLink {...link} />}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}