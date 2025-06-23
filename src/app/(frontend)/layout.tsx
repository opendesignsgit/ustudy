import type { Metadata } from 'next'

import { cn } from 'src/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { AuthProvider } from '@/providers/Auth'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { WebsiteSetting } from '@/payload-types'

import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const websiteSettings: WebsiteSetting = await getCachedGlobal('website-settings', 1)()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getServerSideURL()

  const getMediaUrl = (
    media: number | { url?: string | null } | null | undefined
  ): string | undefined =>
    media &&
      typeof media === 'object' &&
      'url' in media &&
      media.url
      ? media.url.startsWith('http')
        ? media.url
        : siteUrl + media.url
      : undefined

  const getMimeType = (
    media: number | { mimeType?: string | null } | null | undefined
  ): string | undefined =>
    media &&
      typeof media === 'object' &&
      'mimeType' in media &&
      typeof media.mimeType === 'string'
      ? media.mimeType
      : undefined

  return (
    <AuthProvider>
      <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
        <head>
          <InitTheme />
          {/* Dynamic favicon from global settings */}
          {websiteSettings?.favicon && typeof websiteSettings.favicon === 'object' && (
            <link
              rel="icon"
              href={getMediaUrl(websiteSettings.favicon)}
              sizes="32x32"
              type={getMimeType(websiteSettings.favicon) || 'image/png'}
            />
          )}

          {/* Default Meta */}
          <title>{websiteSettings?.metaTitle || 'UStudy Global'}</title>
          {websiteSettings?.metaDescription && (
            <meta name="description" content={websiteSettings.metaDescription} />
          )}
          {/* OG tags */}
          <meta property="og:title" content={websiteSettings?.metaTitle || 'UStudy Global'} />
          <meta property="og:description" content={websiteSettings?.metaDescription || ''} />
          {websiteSettings?.metaImage && typeof websiteSettings.metaImage === 'object' && (
            <meta property="og:image" content={getMediaUrl(websiteSettings.metaImage)} />
          )}

          {/* Google Analytics */}
          {websiteSettings?.gtagID && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${websiteSettings.gtagID}`}></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${websiteSettings.gtagID}');
                  `,
                }}
              />
            </>
          )}
        </head>
        <body>
          <Providers>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
            <Header />
            {children}
            <Footer />
          </Providers>
        </body>
      </html>
    </AuthProvider>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}