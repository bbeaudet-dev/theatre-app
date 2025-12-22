import { GamesHome, type GameData } from 'app/components/sections'
import GamesClient from './GamesClient'

export const metadata = {
  title: "Games & Puzzles",
  description: 'My favorite games, achievements, and gaming experiences.',
}

export default function GamesPage() {
  const games = GamesHome()
  
  return <GamesClient games={games} />
} 