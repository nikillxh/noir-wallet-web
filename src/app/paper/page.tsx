import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import styles from './paper.module.css'

const title = 'The Custody–Privacy Gap'
const description =
  'Research using Noir Wallet to examine where hardware-backed self-custody ends and transaction privacy begins.'
const socialDescription =
  'What a ten-dollar hardware wallet reveals about self-custody on public ledgers.'
const socialImage = {
  url: '/social/noir-paper-card.png',
  width: 680,
  height: 381,
  type: 'image/png',
  alt: 'First page of The Custody–Privacy Gap research paper',
}

export const metadata: Metadata = {
  title: `${title} — NOIR Wallet`,
  description,
  alternates: { canonical: '/paper' },
  openGraph: {
    type: 'article',
    siteName: 'NOIR Wallet',
    title,
    description: socialDescription,
    url: '/paper',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@NoirWallet',
    title,
    description: socialDescription,
    images: [{ url: socialImage.url, alt: socialImage.alt }],
  },
}

export const viewport: Viewport = {
  themeColor: '#111313',
}

export default function PaperPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Back to NOIR home">
          NOIR / v0
        </Link>
        <div className={styles.paperTitle}>
          <h1>{title}</h1>
          <p>Arnav Panjla · Sahitya Shankar · Ledger N3XT</p>
        </div>
        <nav className={styles.actions} aria-label="Paper actions">
          <a href="/paper/Noir_Wallet.pdf" target="_blank" rel="noopener">
            Open PDF
          </a>
          <a href="/paper/Noir_Wallet.pdf" download>
            Download
          </a>
        </nav>
      </header>
      <main className={styles.reader}>
        <object
          className={styles.document}
          data="/paper/Noir_Wallet.pdf#view=FitH"
          type="application/pdf"
          aria-label="The Custody–Privacy Gap research paper"
        >
          <div className={styles.fallback}>
            <p>Your browser cannot display this PDF inline.</p>
            <a href="/paper/Noir_Wallet.pdf">Open the paper directly</a>
          </div>
        </object>
      </main>
    </div>
  )
}
