'use client'

import { useState } from 'react'
import type { Candidate } from '@/lib/types'

const PARTY_COLORS: Record<string, string> = {
  Democrat:    'border-blue-500 ring-blue-500',
  Republican:  'border-red-500 ring-red-500',
  Independent: 'border-purple-500 ring-purple-500',
}

const PARTY_BG: Record<string, string> = {
  Democrat:    'bg-blue-50 dark:bg-blue-950',
  Republican:  'bg-red-50 dark:bg-red-950',
  Independent: 'bg-purple-50 dark:bg-purple-950',
}

const PARTY_TEXT: Record<string, string> = {
  Democrat:    'text-blue-700 dark:text-blue-300',
  Republican:  'text-red-700 dark:text-red-300',
  Independent: 'text-purple-700 dark:text-purple-300',
}

interface Props {
  candidate: Candidate
  selected: boolean
  onSelect: () => void
  disabled?: boolean
}

export default function CandidateCard({ candidate, selected, onSelect, disabled }: Props) {
  const [imgError, setImgError] = useState(false)
  const fallback = candidate.party === 'Democrat' ? '/fallback/democrat.svg' : '/fallback/republican.svg'
  const imgSrc = imgError || !candidate.photo_url ? fallback : candidate.photo_url

  const borderClass = PARTY_COLORS[candidate.party] ?? 'border-gray-400 ring-gray-400'
  const bgClass     = PARTY_BG[candidate.party]     ?? 'bg-gray-50 dark:bg-gray-900'
  const textClass   = PARTY_TEXT[candidate.party]   ?? 'text-gray-700 dark:text-gray-300'

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`
        relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-150 w-full
        ${bgClass}
        ${selected ? `${borderClass} ring-2 ring-offset-2 scale-[1.02] shadow-lg` : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
        ${disabled ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}
      `}
    >
      {/* Photo */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        <img
          src={imgSrc}
          alt={candidate.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Name */}
      <div className="text-center">
        <p className="font-semibold text-gray-900 dark:text-white text-base">{candidate.name}</p>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${textClass} ${bgClass} border ${borderClass.split(' ')[0]}`}>
          {candidate.party}
        </span>
      </div>

      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  )
}
