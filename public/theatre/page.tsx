import TheatreClient from './TheatreClient'
import { TheatreHome } from 'app/components/sections'

export const metadata = {
  title: "That's Showbiz, Baby",
  description: 'My theatre reviews and experiences from Broadway and beyond.',
}

export default function TheatrePage() {
  const reviews = TheatreHome()
  return <TheatreClient reviews={reviews} />
} 