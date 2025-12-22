import { getTheatreReviews } from 'app/for-fun/theatre/server-utils'

export interface TheatreItem {
  slug: string
  metadata: {
    title: string
    showName: string
    summary: string
    date?: string
    publishedAt: string
    theater?: string
    rating?: {
      emotionalResonance: number
      engagement: number
      orchestration: number
      choreography: number
      wowFactor: number
    }
  }
  content: string
}

export function TheatreHome(): TheatreItem[] {
  return getTheatreReviews()
} 