import { gamesData } from './games-data'

export interface GameData {
  // Core game info
  slug: string
  title: string
  rating: number
  periods: ('childhood' | 'teenager' | 'adult')[]
  
  // Series information
  series?: Array<{
    title: string
    platform: string
  }>
  
  // Media
  images: string[]
  
  // Related content
  blogPosts?: Array<{
    title: string
    slug: string
  }>
  portfolioProjects?: Array<{
    title: string
    slug: string
  }>
  achievements?: Array<{
    title: string
    description: string
  }>
  other?: Array<{
    title: string
    url: string
  }>
}

export function getGames(): GameData[] {
  return gamesData
}

export function getGameBySlug(slug: string): GameData | undefined {
  return gamesData.find(game => game.slug === slug)
}

export function getTopRatedGames(limit: number = 5): GameData[] {
  // Sort by rating (highest first) and return top games
  return gamesData
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit)
} 