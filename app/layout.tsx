import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Who Are You Voting For?',
  description: 'Anonymous, real-time US election polling — no login, no tracking, just your voice.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-10">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
