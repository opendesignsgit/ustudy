// app/dashboard/layout.tsx
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
import { getServerSideURL } from '@/utilities/getURL'
import { redirect } from 'next/navigation';


import '../(frontend)/globals.css';
// import { getUser } from './actions/getUsers';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const { isEnabled } = await draftMode()
    // const user = await getUser();
    // console.log(user)
    // if (!user) {
    //     redirect('/login');
    //     return null;
    // }
    // if (user) { 
    //     redirect('/login');
    //     return null;
    // }
  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          <Header />
          {/* Dashboard layout with aside nav and main content */}
          <div style={{ display: 'flex', minHeight: 'calc(100vh - 200px)' }}>
            <main style={{ flex: 1, padding: '1rem' }}>
              {children}
            </main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
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