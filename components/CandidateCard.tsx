'use client'

import { useState } from 'react'
import type { Candidate } from '@/lib/types'

const PARTY_COLOR: Record<string, string> = {
  Democrat:    '#2563eb',
  Republican:  '#dc2626',
  Independent: '#7c3aed',
}

interface Props {
  candidate: Candidate
  selected: boolean
  onSelect: () => void
  disabled?: boolean
}

export default function CandidateCard({ candidate, selected, onSelect, disabled }: Props) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)

  const fallback =
    candidate.party === 'Democrat'
      ? '/fallback/democrat.svg'
      : '/fallback/republican.svg'
  const imgSrc = imgError || !candidate.photo_url ? fallback : candidate.photo_url

  const partyColor = PARTY_COLOR[candidate.party] ?? '#8899bb'

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 16px',
    borderRadius: '12px',
    border: selected
      ? `2px solid ${partyColor}`
      : `2px solid ${hovered ? '#2e4070' : '#1e2d52'}`,
    background: selected
      ? `rgba(${partyColor === '#2563eb' ? '37,99,235' : partyColor === '#dc2626' ? '220,38,38' : '124,58,237'},0.12)`
      : '#0d1530',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'border-color 0.15s, background 0.15s, transform 0.15s',
    transform: selected ? 'scale(1.01)' : 'scale(1)',
    width: '100%',
    boxSizing: 'border-box',
  }

  const photoWrapStyle: React.CSSProperties = {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: `2px solid ${selected ? partyColor : '#1e2d52'}`,
    background: '#0d1530',
    flexShrink: 0,
  }

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }

  const nameStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: '15px',
    color: '#f0f4ff',
    textAlign: 'center',
    margin: 0,
  }

  const badgeStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    color: partyColor,
    background: `${partyColor}22`,
    border: `1px solid ${partyColor}44`,
    padding: '2px 8px',
    borderRadius: '20px',
    display: 'inline-block',
    marginTop: '4px',
  }

  const checkStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: partyColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <button
      style={cardStyle}
      onClick={onSelect}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={photoWrapStyle}>
        <img
          src={imgSrc}
          alt={candidate.name}
          style={imgStyle}
          onError={() => setImgError(true)}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={nameStyle}>{candidate.name}</p>
        <span style={badgeStyle}>{candidate.party}</span>
      </div>

      {selected && (
        <div style={checkStyle}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 20 20"
            fill="white"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </button>
  )
}
