import { cn } from 'src/utilities/cn'
import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { YearlyCoursesBlock } from '@/blocks/CoursesComponents/YearsModule/Component'
import { RegisterFormBlock } from './RegisterForm/config'
import { UniversityHero } from '@/blocks/UniversityTemplateBlocks/UniversityHero/Component'
import { UniversityAbout } from '@/blocks/UniversityTemplateBlocks/UniversityAbout/Component'
import { UniversityPrograms } from '@/blocks/UniversityTemplateBlocks/UniversityPrograms/Component'
import { UniversityContact } from '@/blocks/UniversityTemplateBlocks/UniversityContact/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  yearlyBlock: YearlyCoursesBlock,
  registerBlock: RegisterFormBlock,
  'university-hero': UniversityHero,
  'university-about': UniversityAbout,
  'university-programs': UniversityPrograms,
  'university-contact': UniversityContact,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div key={index} data-attr="kr">
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
