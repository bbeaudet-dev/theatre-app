'use client'

import { useState } from 'react'
import { type GameData } from 'app/for-fun/games/utils'
import GameWordCloud from 'app/components/GameWordCloud'

interface GamesClientProps {
  games: GameData[]
}

export default function GamesClient({ games }: GamesClientProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Playing games as intended, probably.</h1>
      </div>
      
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        My favorite games, from childhood classics to transformative experiences that shaped who I am
      </p>
      
      {/* Game Cloud */}
      <div className="mb-8">
        <GameWordCloud games={games} />
      </div>



      {/* Introduction Paragraph */}
      <div className="prose prose-neutral dark:prose-invert mb-8">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          My relationship with games has evolved significantly over the years. Some of my earliest memories are of playing <strong>Pokemon</strong> on long car rides, simply something to do to fill the in-between time.
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Read more...
            </button>
          )}
        </p>
        
        {isExpanded && (
          <>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              As I grew older, games like <strong>Minecraft</strong> became an escape from difficult emotions and responsibilities.
            </p>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Out of college, I discovered transformative story-driven games that changed me as a person - starting with <strong>Horizon Zero Dawn</strong> and <strong>Subnautica</strong>, and then, once I met my good friend Parth, games like <strong>Undertale</strong>, <strong>Firewatch</strong>, <strong>Hollow Knight</strong>, <strong>Celeste</strong>, and <strong>Outer Wilds</strong> became foundational.
            </p>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              A few years later, having seemingly exhausted all of the "Undertale-like" games, I discovered the world of Sudoku variants - clever rulesets and endless variations that activated the logical, analytical, and creative parts of my brain - eventually leading me to pursue mechanical engineering and technical design work.
            </p>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              As I explored coding and automation in my technical role, I gravitated toward games about building and designing systems - games like <strong>Faster Than Light</strong>, <strong>Plate Up</strong>, <strong>Factorio</strong>, <strong>Opus Magnum</strong>, and <strong>Balatro</strong> that give me the same rush as coding.
            </p>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              While designing and building games for real money would be a dream come true, I still wrestle with the feeling that they're "just games" and that my intelligence might be better used elsewhere. Nevertheless, I can now celebrate and appreciate my relationship with games and how they have shaped me as a human.
            </p>
          </>
        )}
      </div>
    </section>
  )
} 