import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@fontsource-variable/inter'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://noirwallet.vercel.app'),
  title: 'NOIR v0',
  description: 'NOIR v0 — a purpose-built, open hardware wallet.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
