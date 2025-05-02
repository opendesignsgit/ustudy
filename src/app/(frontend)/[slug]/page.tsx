import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import type { Page as PageType } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import EducationPromoSection from '@/components/Home/hero-intro'
import AboutUstudy from '@/components/Home/about-ustudy'
import WhyChooseUs from '@/components/Home/why-choose-us'
import AcademicPathSlider from '@/components/Home/academic-path-slider'
import UniversitySolutionSection from '@/components/Home/university-solution'
import StudyDestinationCarousel from '@/components/Home/study-destination'
import UniversitySlider from '@/components/Home/university-slider'
import FooterForm from '@/components/Home/footer-form'
import Footer from '@/components/Home/footer'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: PageType | null

  page = await queryPageBySlug({
    slug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className={`pt-8 ${slug}`}>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      
      {slug === 'home-new' ? (
        <div>
          <EducationPromoSection></EducationPromoSection>
          <AboutUstudy></AboutUstudy>
          <WhyChooseUs></WhyChooseUs>
          <AcademicPathSlider></AcademicPathSlider>
          <UniversitySolutionSection></UniversitySolutionSection>
          <StudyDestinationCarousel></StudyDestinationCarousel>
          <UniversitySlider></UniversitySlider>
          <FooterForm></FooterForm>
          <Footer></Footer>
        </div>
      ) : (
        <RenderBlocks blocks={layout} />
      )}

    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
