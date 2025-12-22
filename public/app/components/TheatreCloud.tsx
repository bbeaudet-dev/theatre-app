'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { type TheatreShow } from 'app/for-fun/theatre/data/shows-ben'
import { 
  type PositionedShow, 
  createTheatreCloudLayout, 
  getObjectPosition 
} from './TheatreCloudAnimation'

// Format date like "June 15th, 2024"
function formatDateLong(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00Z')
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const month = months[date.getUTCMonth()]
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()
  
  // Add ordinal suffix (st, nd, rd, th)
  const getOrdinal = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }
  
  return `${month} ${getOrdinal(day)}, ${year}`
}

interface TheatreCloudProps {
  shows: TheatreShow[]
  showFilters?: boolean
}

export default function TheatreCloud({ shows, showFilters = true }: TheatreCloudProps) {
  const [selectedShow, setSelectedShow] = useState<TheatreShow | null>(null)
  const [positionedShows, setPositionedShows] = useState<PositionedShow[]>([])
  const [filter, setFilter] = useState<'all' | 'Broadway' | 'Playhouse Square' | 'West End' | 'Off-Broadway' | 'Local' | 'Touring'>('all')
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({})
  const [imageOpacity, setImageOpacity] = useState<Record<string, number>>({})
  const [showScale, setShowScale] = useState<Record<string, number>>({})
  const [currentPattern, setCurrentPattern] = useState(0)
  
  // Filter shows based on selected district - memoized to prevent recreation
  const filteredShows = useMemo(() => {
    return shows.filter(show => {
      if (filter === 'all') return true
      if (filter === 'Broadway') {
        return show.visits.some(visit => 
          visit.district === 'Broadway'
        )
      }
      if (filter === 'Touring') {
        return show.visits.some(visit => 
          visit.district === 'Touring'
        )
      }
      return show.visits.some(visit => visit.district === filter)
    })
  }, [shows, filter])

  // Helper function to count shows by district
  const getShowCountByDistrict = (district: string) => {
    if (district === 'Other') {
      return shows.filter(show => 
        show.visits.some(visit => 
          visit.district !== 'Broadway' && 
          visit.district !== 'Playhouse Square' &&
          visit.district !== 'West End' &&
          visit.district !== 'Off-Broadway' &&
          visit.district !== 'Local' &&
          visit.district !== 'Touring'
        )
      ).length
    }
    if (district === 'Broadway') {
      return shows.filter(show => 
        show.visits.some(visit => 
          visit.district === 'Broadway'
        )
      ).length
    }
    if (district === 'Touring') {
      return shows.filter(show => 
        show.visits.some(visit => 
          visit.district === 'Touring'
        )
      ).length
    }
    return shows.filter(show => show.visits.some(visit => visit.district === district)).length
  }

  // Initialize image indexes for shows with multiple images
  useEffect(() => {
    const initialIndexes: Record<string, number> = {}
    const initialOpacity: Record<string, number> = {}
    const initialScale: Record<string, number> = {}
    shows.forEach(show => {
      if (show.images.length > 1) {
        initialIndexes[show.slug] = 0
        initialOpacity[show.slug] = 1
      }
      initialScale[show.slug] = 1 // All shows start at normal scale
    })
    setImageIndexes(initialIndexes)
    setImageOpacity(initialOpacity)
    setShowScale(initialScale)
  }, [shows])

  // Update image indexes when filter changes to include new filtered shows
  useEffect(() => {
    setImageIndexes(prev => {
      const newIndexes = { ...prev }
      filteredShows.forEach(show => {
        if (show.images.length > 1 && !(show.slug in newIndexes)) {
          newIndexes[show.slug] = 0
        }
      })
      return newIndexes
    })
  }, [filteredShows])

  // Update layout when filtered shows change
  useEffect(() => {
    const layout = createTheatreCloudLayout(filteredShows)
    setPositionedShows(layout)
  }, [filteredShows])

  const handleShowClick = (show: TheatreShow, e?: React.MouseEvent) => {
    e?.stopPropagation() // Prevent event from bubbling to container
    setSelectedShow(selectedShow?.slug === show.slug ? null : show)
  }

  const handleContainerClick = () => {
    if (selectedShow) {
      setSelectedShow(null)
    }
  }

  // Global click handler to deselect when clicking outside the component
  useEffect(() => {
    if (!selectedShow) return

    const handleGlobalClick = (e: MouseEvent) => {
      // Check if the click is outside the theatre cloud container
      const target = e.target as HTMLElement
      const cloudContainer = target.closest('[data-theatre-cloud]')
      if (!cloudContainer) {
        setSelectedShow(null)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedShow(null)
      }
    }

    // Add listener with a small delay to avoid immediate deselection
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleGlobalClick)
      document.addEventListener('keydown', handleKeyDown)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleGlobalClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedShow])

  // Wave animation for all shows (alternating patterns)
  useEffect(() => {
    const interval = setInterval(() => {
      // Get all shows in order based on current pattern
      let showsInOrder = [...filteredShows]
      
      switch (currentPattern) {
        case 0: // Top-left to bottom-right diagonal
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show.slug === a.slug)
            const showB = positionedShows.find(ps => ps.show.slug === b.slug)
            if (!showA || !showB) return 0
            const diagonalA = showA.x + showA.y
            const diagonalB = showB.x + showB.y
            return diagonalA - diagonalB
          })
          break
          
        case 1: // Top-right to bottom-left diagonal
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show.slug === a.slug)
            const showB = positionedShows.find(ps => ps.show.slug === b.slug)
            if (!showA || !showB) return 0
            const diagonalA = showA.x - showA.y
            const diagonalB = showB.x - showB.y
            return diagonalB - diagonalA // Reverse order
          })
          break
          
        case 2: // Bottom-right to top-left diagonal
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show.slug === a.slug)
            const showB = positionedShows.find(ps => ps.show.slug === b.slug)
            if (!showA || !showB) return 0
            const diagonalA = showA.x + showA.y
            const diagonalB = showB.x + showB.y
            return diagonalB - diagonalA // Reverse order
          })
          break
          
        case 3: // Bottom-left to top-right diagonal
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show.slug === a.slug)
            const showB = positionedShows.find(ps => ps.show.slug === b.slug)
            if (!showA || !showB) return 0
            const diagonalA = showA.x - showA.y
            const diagonalB = showB.x - showB.y
            return diagonalA - diagonalB
          })
          break
          
        case 4: // Outwards from center to edges
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show.slug === a.slug)
            const showB = positionedShows.find(ps => ps.show.slug === b.slug)
            if (!showA || !showB) return 0
            const centerX = 400 // Approximate center
            const centerY = 300
            const distanceA = Math.sqrt((showA.x - centerX) ** 2 + (showA.y - centerY) ** 2)
            const distanceB = Math.sqrt((showB.x - centerX) ** 2 + (showB.y - centerY) ** 2)
            return distanceA - distanceB // Closest to furthest
          })
          break
          
        case 5: // Inwards from edges to center
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show.slug === a.slug)
            const showB = positionedShows.find(ps => ps.show.slug === b.slug)
            if (!showA || !showB) return 0
            const centerX = 400 // Approximate center
            const centerY = 300
            const distanceA = Math.sqrt((showA.x - centerX) ** 2 + (showA.y - centerY) ** 2)
            const distanceB = Math.sqrt((showB.x - centerX) ** 2 + (showB.y - centerY) ** 2)
            return distanceB - distanceA // Furthest to closest
          })
          break
      }
      
      // Stagger the wave animation
      showsInOrder.forEach((show, index) => {
        const delay = index * 35 // Slightly faster: 50ms -> 35ms delay between each show
        
        setTimeout(() => {
          // Scale up (20% bigger: 1.15 -> 1.38)
          setShowScale(prev => ({
            ...prev,
            [show.slug]: 1.125
          }))
          
          // Change image at peak size (after 200ms of growing - faster)
          setTimeout(() => {
            if (show.images.length > 1) {
              // Start cross-fade
              setImageOpacity(prev => ({
                ...prev,
                [show.slug]: 0
              }))
              
              // After cross-fade completes, update image index (faster: 2000ms -> 1500ms)
              setTimeout(() => {
                setImageIndexes(prev => {
                  const currentIndex = prev[show.slug] || 0
                  return {
                    ...prev,
                    [show.slug]: (currentIndex + 1) % show.images.length
                  }
                })
                
                // Reset opacity for this show
                setImageOpacity(prev => ({
                  ...prev,
                  [show.slug]: 1
                }))
              }, 1500) // Faster cross-fade
            }
          }, 200) // Faster: 300ms -> 200ms to reach peak size
          
          // Scale back down after 600ms (faster: 800ms -> 600ms)
          setTimeout(() => {
            setShowScale(prev => ({
              ...prev,
              [show.slug]: 1
            }))
          }, 600) // Faster scale down
        }, delay)
      })
      
      // Move to next pattern
      setCurrentPattern((prev) => (prev + 1) % 6)
      
    }, 3500) // Faster: 5 seconds -> 3.5 seconds
    
    return () => {
      clearInterval(interval)
    }
  }, [filteredShows, positionedShows, currentPattern])

  // Find the positioned show for the selected show
  const selectedPositionedShow = selectedShow 
    ? positionedShows.find(ps => ps.show.slug === selectedShow.slug)
    : null

  // Calculate bubble position if a show is selected
  const bubblePosition = useMemo(() => {
    if (!selectedPositionedShow) return null
    
    const bubbleWidth = Math.max(300, Math.min(380, selectedPositionedShow.width * 2.5))
    // Center the bubble horizontally relative to the show's center
    const showCenterX = selectedPositionedShow.x + selectedPositionedShow.width / 2
    const bubbleLeft = showCenterX - bubbleWidth / 2
    const bubbleTop = selectedPositionedShow.y + selectedPositionedShow.height + 10
    
    // Adjust position if bubble would overflow container
    let adjustedLeft = bubbleLeft
    let adjustedTop = bubbleTop
    
    // Check right edge overflow
    if (bubbleLeft + bubbleWidth > 800) {
      adjustedLeft = 800 - bubbleWidth - 10
    }
    
    // Check left edge overflow
    if (adjustedLeft < 10) {
      adjustedLeft = 10
    }
    
    // Check bottom edge overflow - if it would overflow, position above instead
    const estimatedBubbleHeight = 200 // Rough estimate
    if (bubbleTop + estimatedBubbleHeight > 800) {
      adjustedTop = selectedPositionedShow.y - estimatedBubbleHeight - 10
    }
    
    return {
      left: adjustedLeft,
      top: adjustedTop,
      width: bubbleWidth
    }
  }, [selectedPositionedShow])

  return (
    <div data-theatre-cloud>
      {/* Theatre Cloud */}
      <div className="flex-1">
        <div 
          className="relative" 
          style={{ width: '800px', height: '800px' }}
          onClick={handleContainerClick}
        >
      {positionedShows.map((positionedShow) => {
        const isSelected = selectedShow?.slug === positionedShow.show.slug
        const baseScale = showScale[positionedShow.show.slug] ?? 1
        const finalScale = isSelected ? baseScale * 1.15 : baseScale
        
        return (
          <div
            key={positionedShow.show.slug}
            className="absolute cursor-pointer transition-all duration-500 hover:scale-105"
            style={{
              left: positionedShow.x,
              top: positionedShow.y,
              width: positionedShow.width,
              height: positionedShow.height,
              transform: `scale(${finalScale})`,
              transition: 'transform 0.5s ease-in-out, filter 0.25s ease-in-out',
              zIndex: isSelected ? 1000 : Math.round(positionedShow.width), // Selected show gets highest z-index
              filter: selectedShow && !isSelected ? 'blur(2px) brightness(0.7)' : 'none'
            }}
            onClick={(e) => handleShowClick(positionedShow.show, e)}
          >
            {positionedShow.show.images.length > 0 ? (
              <div 
                className="w-full h-full overflow-hidden"
                style={{ borderRadius: `${Math.max(2, Math.min(8, positionedShow.width * 0.1))}px` }}
              >
                <div
                  className={`relative overflow-hidden border transition-all duration-300 ${
                    isSelected 
                      ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400 ring-opacity-50' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{
                    width: positionedShow.width,
                    height: positionedShow.height,
                    borderRadius: `${Math.max(2, Math.min(8, positionedShow.width * 0.1))}px`,
                    boxShadow: isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  <div className="relative w-full h-full">
                    {/* Current image */}
                    <Image
                      key={`${positionedShow.show.slug}-current-${imageIndexes[positionedShow.show.slug] || 0}`}
                      src={positionedShow.show.images[imageIndexes[positionedShow.show.slug] || 0]}
                      alt={positionedShow.show.name}
                      width={positionedShow.width}
                      height={positionedShow.height}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
                      style={{
                        objectPosition: getObjectPosition(positionedShow.show.slug),
                        opacity: imageOpacity[positionedShow.show.slug] ?? 1,
                        transitionDuration: '1200ms'
                      }}
                    />
                    
                    {/* Next image (for cross-fade) */}
                    {positionedShow.show.images.length > 1 && (
                      <Image
                        key={`${positionedShow.show.slug}-next-${((imageIndexes[positionedShow.show.slug] || 0) + 1) % positionedShow.show.images.length}`}
                        src={positionedShow.show.images[((imageIndexes[positionedShow.show.slug] || 0) + 1) % positionedShow.show.images.length]}
                        alt={positionedShow.show.name}
                        width={positionedShow.width}
                        height={positionedShow.height}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
                        style={{
                          objectPosition: getObjectPosition(positionedShow.show.slug),
                          opacity: (imageOpacity[positionedShow.show.slug] ?? 1) === 1 ? 0 : 1,
                          transitionDuration: '1200ms'
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
                  borderRadius: `${Math.max(2, Math.min(8, positionedShow.width * 0.1))}px`,
                  padding: `${Math.max(1, positionedShow.width * 0.05)}px`
                }}
              >
                <span 
                  className="font-medium text-gray-700 dark:text-gray-300 leading-tight break-words"
                  style={{ 
                    fontSize: `${Math.max(8, Math.min(12, positionedShow.width * 0.15))}px`,
                    lineHeight: '1.1'
                  }}
                >
                  {positionedShow.show.name}
                </span>
              </div>
            )}
          </div>
        )
      })}
      
      {/* Selected Show Details - Bubble positioned under the selected show */}
      {selectedShow && selectedPositionedShow && bubblePosition && (
        <div
          className="absolute bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300"
          style={{
            left: `${bubblePosition.left}px`,
            top: `${bubblePosition.top}px`,
            width: `${bubblePosition.width}px`,
            zIndex: 1001,
            maxWidth: '380px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-base font-semibold mb-1.5 text-gray-900 dark:text-gray-100">{selectedShow.name}</h3>
          
          {/* Show Info */}
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <p><strong>Rank:</strong> #{selectedShow.rank} of {shows.length}</p>
            <p><strong>Visits:</strong></p>
            {selectedShow.visits.map((visit, index) => (
              <div key={visit.chronologicalId} className="ml-1">
                <p>{visit.theatre} ({visit.district}) - {formatDateLong(visit.date)}</p>
                {visit.notes && <p className="ml-2 italic text-[11px]">Notes: {visit.notes}</p>}
              </div>
            ))}
            
            {/* Linked Reviews */}
            {selectedShow.reviews && selectedShow.reviews.length > 0 && (
              <div className="mt-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-700">
                <p className="font-semibold mb-0.5 text-gray-700 dark:text-gray-300 text-xs">Reviews:</p>
                <ul className="space-y-0">
                  {selectedShow.reviews.map((review, index) => (
                    <li key={index}>
                      <Link 
                        href={`/for-fun/theatre/${review.slug}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                      >
                        {review.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Linked Blog Posts */}
            {selectedShow.blogPosts && selectedShow.blogPosts.length > 0 && (
              <div className="mt-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-700">
                <p className="font-semibold mb-0.5 text-gray-700 dark:text-gray-300 text-xs">Blog Posts:</p>
                <ul className="space-y-0">
                  {selectedShow.blogPosts.map((post, index) => (
                    <li key={index}>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Filter Controls - underneath the cloud */}
      {showFilters && (
      <div className="flex justify-center space-x-2 mt-8 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All ({shows.length})
        </button>
        <button
          onClick={() => setFilter('Broadway')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'Broadway'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Broadway ({getShowCountByDistrict('Broadway')})
        </button>
        <button
          onClick={() => setFilter('Off-Broadway')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'Off-Broadway'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Off-Broadway ({getShowCountByDistrict('Off-Broadway')})
        </button>
        <button
          onClick={() => setFilter('Playhouse Square')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'Playhouse Square'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Playhouse Square ({getShowCountByDistrict('Playhouse Square')})
        </button>
        <button
          onClick={() => setFilter('West End')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'West End'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          West End ({getShowCountByDistrict('West End')})
        </button>
        <button
          onClick={() => setFilter('Touring')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'Touring'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Touring ({getShowCountByDistrict('Touring')})
        </button>
        <button
          onClick={() => setFilter('Local')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            filter === 'Local'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Local ({getShowCountByDistrict('Local')})
        </button>
      </div>
      )}

    </div>
  )
} 