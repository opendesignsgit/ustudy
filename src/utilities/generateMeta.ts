import type { Metadata } from 'next'

import type { Media, Page, Post, Config, WebsiteSetting } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

import { getCachedGlobal } from '@/utilities/getGlobals'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    return ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return undefined
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post>
}): Promise<Metadata> => {
  const { doc } = args || {}

  // Get website settings from cache/global
  const websiteSettings: WebsiteSetting = await getCachedGlobal('website-settings', 1)()

  // Title: doc meta > global meta > fallback
  const title = doc?.meta?.title
    ? `${doc.meta.title} | UStudy Global`
    : websiteSettings.metaTitle
      ? websiteSettings.metaTitle
      : 'UStudy Global'

  // Description: doc meta > global meta > fallback
  const description = doc?.meta?.description
    || websiteSettings.metaDescription
    || ''

  // OG Image: doc meta > global meta > fallback
  const ogImage =
    getImageURL(doc?.meta?.image) ||
    getImageURL(websiteSettings.metaImage) ||
    getServerSideURL() + '/website-template-OG.webp'

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
  }
}