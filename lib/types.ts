export interface Election {
  id: number
  slug: string
  title: string
  type: 'current' | 'hypothetical'
  status: 'upcoming' | 'active' | 'closed'
  created_at: string
  candidates: Candidate[]
}

export interface Candidate {
  id: number
  election_id: number
  name: string
  party: string
  photo_url: string | null
}

export interface VoteResult {
  candidate_id: number
  candidate_name: string
  party: string
  photo_url: string | null
  total_votes: number
  percentage: number
  by_state: StateResult[]
}

export interface StateResult {
  state: string
  count: number
}

export interface VoteResponse {
  success?: boolean
  alreadyVoted?: boolean
  results: VoteResult[]
  total_votes: number
}
