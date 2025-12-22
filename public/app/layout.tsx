import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/Nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/Footer'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Ben Beaudet\'s Website',
    template: '%s | Ben Beaudet\'s Website',
  },
  description: 'Personal blog and portfolio of Ben Beaudet',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Ben Beaudet\'s Website',
    description: 'Personal blog and portfolio of Ben Beaudet',
    url: baseUrl,
    siteName: "Ben Beaudet\'s Website",
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased max-w-2xl mx-4 mt-8 lg:mx-auto print:max-w-none print:mx-0 print:mt-0">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0 print:mt-0 print:px-0">
          <div className="print:hidden">
            <Navbar />
          </div>
          {children}
          <div className="print:hidden">
            <Footer />
          </div>
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
