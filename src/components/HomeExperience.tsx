'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import NoirHero from './NoirHero'

const ExplodedWallet = dynamic(() => import('./ExplodedWallet'), {
  loading: ProductPlaceholder,
  ssr: false,
})

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

function ProductPlaceholder() {
  return (
    <section
      id="hardware"
      className="product product--loading"
      aria-label="Loading NOIR wallet exploded view"
    >
      <div className="product__sticky">
        <div className="product__chrome" aria-hidden="true">
          <span>NOIR / v0</span>
          <span>HARDWARE ARCHITECTURE</span>
        </div>
        <span className="product__loader">Preparing hardware model</span>
      </div>
    </section>
  )
}

export default function HomeExperience() {
  const reducedMotion = useReducedMotion()
  const loadTrigger = useRef<HTMLDivElement>(null)
  const [loadProduct, setLoadProduct] = useState(false)

  useEffect(() => {
    const trigger = loadTrigger.current
    if (!trigger || loadProduct) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setLoadProduct(true)
        observer.disconnect()
      },
      { rootMargin: '500px 0px' },
    )

    observer.observe(trigger)
    return () => observer.disconnect()
  }, [loadProduct])

  return (
    <>
      <main>
        <NoirHero reducedMotion={reducedMotion} />
        <div ref={loadTrigger} className="product-shell">
          {loadProduct ? (
            <ExplodedWallet reducedMotion={reducedMotion} />
          ) : (
            <ProductPlaceholder />
          )}
        </div>
      </main>
      <footer className="site-footer">
        <span>NOIR / v0</span>
        <nav className="site-footer__links" aria-label="Project links">
          <Link href="/paper">Read the paper</Link>
          <a href="https://x.com/NoirWallet">Follow @NoirWallet on X</a>
        </nav>
      </footer>
    </>
  )
}
