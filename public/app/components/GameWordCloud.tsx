'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { type GameData } from 'app/for-fun/games/utils'
import { 
  type PositionedGame, 
  createWordCloudLayout, 
  getObjectPosition 
} from './GameWordCloudAnimation'
import RelatedGameContent from './RelatedGameContent'

interface GameWordCloudProps {
  games: GameData[]
}

export default function GameWordCloud({ games }: GameWordCloudProps) {
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null)
  const [positionedGames, setPositionedGames] = useState<PositionedGame[]>([])
  const [filter, setFilter] = useState<'all' | 'childhood' | 'teenager' | 'adult'>('all')
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({})
  const [imageOpacity, setImageOpacity] = useState<Record<string, number>>({})
  const [gameScale, setGameScale] = useState<Record<string, number>>({})
  const [currentPattern, setCurrentPattern] = useState(0)
  
  // Filter games based on selected period - memoized to prevent recreation
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      if (filter === 'all') return true
      return game.periods.includes(filter)
    })
  }, [games, filter])

  // Initialize image indexes for games with multiple images
  useEffect(() => {
    const initialIndexes: Record<string, number> = {}
    const initialOpacity: Record<string, number> = {}
    const initialScale: Record<string, number> = {}
    games.forEach(game => {
      if (game.images.length > 1) {
        initialIndexes[game.slug] = 0
        initialOpacity[game.slug] = 1
      }
      initialScale[game.slug] = 1 // All games start at normal scale
    })
    setImageIndexes(initialIndexes)
    setImageOpacity(initialOpacity)
    setGameScale(initialScale)
  }, [games])

  // Update image indexes when filter changes to include new filtered games
  useEffect(() => {
    setImageIndexes(prev => {
      const newIndexes = { ...prev }
      filteredGames.forEach(game => {
        if (game.images.length > 1 && !(game.slug in newIndexes)) {
          newIndexes[game.slug] = 0
        }
      })
      return newIndexes
    })
  }, [filteredGames])

  // Update layout when filtered games change
  useEffect(() => {
    const layout = createWordCloudLayout(filteredGames)
    setPositionedGames(layout)
  }, [filteredGames])

  const handleGameClick = (game: GameData) => {
    setSelectedGame(selectedGame?.slug === game.slug ? null : game)
  }

  // Wave animation for all games (alternating patterns)
  useEffect(() => {
    const interval = setInterval(() => {
      // Get all games in order based on current pattern
      let gamesInOrder = [...filteredGames]
      
      switch (currentPattern) {
        case 0: // Top-left to bottom-right diagonal
          gamesInOrder.sort((a, b) => {
            const gameA = positionedGames.find(pg => pg.game.slug === a.slug)
            const gameB = positionedGames.find(pg => pg.game.slug === b.slug)
            if (!gameA || !gameB) return 0
            const diagonalA = gameA.x + gameA.y
            const diagonalB = gameB.x + gameB.y
            return diagonalA - diagonalB
          })
          break
          
        case 1: // Top-right to bottom-left diagonal
          gamesInOrder.sort((a, b) => {
            const gameA = positionedGames.find(pg => pg.game.slug === a.slug)
            const gameB = positionedGames.find(pg => pg.game.slug === b.slug)
            if (!gameA || !gameB) return 0
            const diagonalA = gameA.x - gameA.y
            const diagonalB = gameB.x - gameB.y
            return diagonalB - diagonalA // Reverse order
          })
          break
          
        case 2: // Bottom-right to top-left diagonal
          gamesInOrder.sort((a, b) => {
            const gameA = positionedGames.find(pg => pg.game.slug === a.slug)
            const gameB = positionedGames.find(pg => pg.game.slug === b.slug)
            if (!gameA || !gameB) return 0
            const diagonalA = gameA.x + gameA.y
            const diagonalB = gameB.x + gameB.y
            return diagonalB - diagonalA // Reverse order
          })
          break
          
        case 3: // Bottom-left to top-right diagonal
          gamesInOrder.sort((a, b) => {
            const gameA = positionedGames.find(pg => pg.game.slug === a.slug)
            const gameB = positionedGames.find(pg => pg.game.slug === b.slug)
            if (!gameA || !gameB) return 0
            const diagonalA = gameA.x - gameA.y
            const diagonalB = gameB.x - gameB.y
            return diagonalA - diagonalB
          })
          break
          
        case 4: // Outwards from center to edges
          gamesInOrder.sort((a, b) => {
            const gameA = positionedGames.find(pg => pg.game.slug === a.slug)
            const gameB = positionedGames.find(pg => pg.game.slug === b.slug)
            if (!gameA || !gameB) return 0
            const centerX = 400 // Approximate center
            const centerY = 300
            const distanceA = Math.sqrt((gameA.x - centerX) ** 2 + (gameA.y - centerY) ** 2)
            const distanceB = Math.sqrt((gameB.x - centerX) ** 2 + (gameB.y - centerY) ** 2)
            return distanceA - distanceB // Closest to furthest
          })
          break
          
        case 5: // Inwards from edges to center
          gamesInOrder.sort((a, b) => {
            const gameA = positionedGames.find(pg => pg.game.slug === a.slug)
            const gameB = positionedGames.find(pg => pg.game.slug === b.slug)
            if (!gameA || !gameB) return 0
            const centerX = 400 // Approximate center
            const centerY = 300
            const distanceA = Math.sqrt((gameA.x - centerX) ** 2 + (gameA.y - centerY) ** 2)
            const distanceB = Math.sqrt((gameB.x - centerX) ** 2 + (gameB.y - centerY) ** 2)
            return distanceB - distanceA // Furthest to closest
          })
          break
      }
      
      // Stagger the wave animation
      gamesInOrder.forEach((game, index) => {
        const delay = index * 21 // 30% faster: 30ms -> 21ms delay between each game
        
        setTimeout(() => {
          // Scale up (20% bigger: 1.15 -> 1.38)
          setGameScale(prev => ({
            ...prev,
            [game.slug]: 1.125
          }))
          
          // Change image at peak size (after 150ms of growing)
          setTimeout(() => {
            if (game.images.length > 1) {
              // Start cross-fade
              setImageOpacity(prev => ({
                ...prev,
                [game.slug]: 0
              }))
              
              // After cross-fade completes, update image index
              setTimeout(() => {
                setImageIndexes(prev => {
                  const currentIndex = prev[game.slug] || 0
                  return {
                    ...prev,
                    [game.slug]: (currentIndex + 1) % game.images.length
                  }
                })
                
                // Reset opacity for this game
                setImageOpacity(prev => ({
                  ...prev,
                  [game.slug]: 1
                }))
              }, 1250)
            }
          }, 150) // Change image at peak size
          
          // Scale back down after 450ms (longer duration: 210ms -> 450ms)
          setTimeout(() => {
            setGameScale(prev => ({
              ...prev,
              [game.slug]: 1
            }))
          }, 450)
        }, delay)
      })
      
      // Move to next pattern
      setCurrentPattern((prev) => (prev + 1) % 6)
      
    }, 2000) // Every 2 seconds
    
    return () => {
      clearInterval(interval)
    }
  }, [filteredGames, positionedGames, currentPattern])

  return (
    <div>
      {/* Top section: Cloud and Detail Box side by side */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Game Cloud - Left side */}
        <div className="flex-1">
          <div className="relative" style={{ width: '800px', height: '800px' }}>
        {positionedGames.map((positionedGame) => (
          <div
            key={positionedGame.game.slug}
            className="absolute cursor-pointer transition-all duration-200 hover:scale-105"
            style={{
              left: positionedGame.x,
              top: positionedGame.y,
              width: positionedGame.width,
              height: positionedGame.height,
              transform: `scale(${gameScale[positionedGame.game.slug] ?? 1})`,
              transition: 'transform 0.5s ease-in-out',
              zIndex: Math.round(positionedGame.width) // Bigger icons get higher z-index
            }}
            onClick={() => handleGameClick(positionedGame.game)}
          >
            {positionedGame.game.images.length > 0 ? (
              <div 
                className="w-full h-full overflow-hidden"
                style={{ borderRadius: `${Math.max(2, Math.min(8, positionedGame.width * 0.1))}px` }}
              >
                <div
                  className="relative overflow-hidden border border-gray-300 dark:border-gray-600"
                  style={{
                    width: positionedGame.width,
                    height: positionedGame.height,
                    borderRadius: `${Math.max(2, Math.min(8, positionedGame.width * 0.1))}px`
                  }}
                >
                  <div className="relative w-full h-full">
                    {/* Current image */}
                    <Image
                      key={`${positionedGame.game.slug}-current-${imageIndexes[positionedGame.game.slug] || 0}`}
                      src={positionedGame.game.images[imageIndexes[positionedGame.game.slug] || 0]}
                      alt={positionedGame.game.title}
                      width={positionedGame.width}
                      height={positionedGame.height}
                      className={`absolute inset-0 w-full h-full transition-opacity ease-in-out ${
                        positionedGame.game.slug === 'anatomy' ? 'object-contain' : 'object-cover'
                      }`}
                      style={{
                        objectPosition: getObjectPosition(positionedGame.game.slug),
                        opacity: imageOpacity[positionedGame.game.slug] ?? 1,
                        transitionDuration: '750ms'
                      }}
                    />
                    
                    {/* Next image (for cross-fade) */}
                    {positionedGame.game.images.length > 1 && (
                      <Image
                        key={`${positionedGame.game.slug}-next-${((imageIndexes[positionedGame.game.slug] || 0) + 1) % positionedGame.game.images.length}`}
                        src={positionedGame.game.images[((imageIndexes[positionedGame.game.slug] || 0) + 1) % positionedGame.game.images.length]}
                        alt={positionedGame.game.title}
                        width={positionedGame.width}
                        height={positionedGame.height}
                        className={`absolute inset-0 w-full h-full transition-opacity ease-in-out ${
                          positionedGame.game.slug === 'anatomy' ? 'object-contain' : 'object-cover'
                        }`}
                        style={{
                          objectPosition: getObjectPosition(positionedGame.game.slug),
                          opacity: (imageOpacity[positionedGame.game.slug] ?? 1) === 1 ? 0 : 1,
                          transitionDuration: '750ms'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-center overflow-hidden"
                style={{ 
                  borderRadius: `${Math.max(2, Math.min(8, positionedGame.width * 0.1))}px`,
                  padding: `${Math.max(1, positionedGame.width * 0.05)}px`
                }}
              >
                <span 
                  className="font-medium text-gray-700 dark:text-gray-300 leading-tight break-words"
                  style={{ 
                    fontSize: `${Math.max(8, Math.min(12, positionedGame.width * 0.15))}px`,
                    lineHeight: '1.1'
                  }}
                >
                  {positionedGame.game.title}
                </span>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      {/* Selected Game Details - Right side */}
      {selectedGame && (
        <div className="flex-1 lg:max-w-2xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-3">{selectedGame.title}</h3>
            
            {/* Related Content */}
            <RelatedGameContent game={selectedGame} />
          </div>
        </div>
      )}
      </div>

      {/* Filter Controls - underneath the cloud */}
      <div className="flex justify-center space-x-2 mt-8 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All ({games.length})
        </button>
        <button
          onClick={() => setFilter('childhood')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'childhood'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Childhood ({games.filter(g => g.periods.includes('childhood')).length})
        </button>
        <button
          onClick={() => setFilter('teenager')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'teenager'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Teenager ({games.filter(g => g.periods.includes('teenager')).length})
        </button>
        <button
          onClick={() => setFilter('adult')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'adult'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Adult ({games.filter(g => g.periods.includes('adult')).length})
        </button>
      </div>

    </div>
  )
}