'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  background: 'rgba(5,9,26,0.92)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid #1e2d52',
}

const innerStyle: React.CSSProperties = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 24px',
  height: '56px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const logoStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '15px',
  letterSpacing: '0.05em',
  color: '#f0f4ff',
  textDecoration: 'none',
}

const navLinksStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}

function navLinkStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: active ? '#f0f4ff' : '#8899bb',
    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
    transition: 'color 0.15s, background 0.15s',
  }
}

export default function Navbar() {
  const pathname = usePathname()

  const tabs = [
    { label: 'Races',        href: '/' },
    { label: 'Hypothetical', href: '/hypothetical' },
    { label: 'About',        href: '/about' },
  ]

  return (
    <nav style={navStyle}>
      <div style={innerStyle}>
        <Link href="/" style={logoStyle}>
          ★ THE BALLOT
        </Link>

        <div style={navLinksStyle}>
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              style={navLinkStyle(pathname === t.href)}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
