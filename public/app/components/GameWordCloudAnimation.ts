import { type GameData } from 'app/for-fun/games/utils'

export interface PositionedGame {
  game: GameData
  x: number
  y: number
  width: number
  height: number
}

// Calculate base size for games (1-10 scale) with dynamic scaling based on game count
export const getBaseSize = (size: number = 5, gameCount: number) => {
  // Base sizes for different game count ranges - increased overall scale
  let minSize, maxSize
  
  if (gameCount <= 20) {
    // Small collection - use larger sizes
    minSize = 35
    maxSize = 180
  } else if (gameCount <= 40) {
    // Medium collection - scale down by 15%
    minSize = 30
    maxSize = 153
  } else if (gameCount <= 60) {
    // Large collection - scale down by 25%
    minSize = 26
    maxSize = 135
  } else if (gameCount <= 80) {
    // Very large collection - scale down by 35%
    minSize = 23
    maxSize = 117
  } else {
    // Massive collection - scale down by 45%
    minSize = 19
    maxSize = 99
  }
  
  const step = (maxSize - minSize) / 9 // 10 sizes total
  const baseSize = Math.round(minSize + (size - 1) * step)
  
  // Much smaller size adjustment for better packing (±3%)
  const isEven = size % 2 === 0
  const adjustedSize = isEven ? Math.round(baseSize * 0.97) : baseSize // 3% smaller for even sizes
  
  return adjustedSize
}

// Check if a rectangle can fit at a given position
export const canFitAt = (x: number, y: number, width: number, height: number, placedRects: Array<{x: number, y: number, width: number, height: number}>) => {
  // Calculate dynamic margin based on item size
  // Smaller items get smaller margins, larger items get proportional margins
  const margin = Math.max(2, Math.min(12, width * 0.08)) // 8% of width, min 2px, max 12px
  
  // Check bounds - increased height to 800px
  if (x < 0 || y < 0 || x + width > 800 || y + height > 800) {
    return false
  }
  
  // Check collision with existing rectangles using dynamic margin
  for (const rect of placedRects) {
    if (x < rect.x + rect.width + margin && x + width + margin > rect.x && y < rect.y + rect.height + margin && y + height + margin > rect.y) {
      return false
    }
  }
  
  return true
}

// Find the best position for a rectangle using spiral search
export const findBestPosition = (width: number, height: number, placedRects: Array<{x: number, y: number, width: number, height: number}>) => {
  const centerX = 400
  const centerY = 400
  const maxRadius = 400
  
  // Simple spiral search - no size adjustments for now
  let angle = 0
  let radius = 0
  const angleStep = 0.1
  const radiusStep = 2
  
  while (radius <= maxRadius) {
    const x = centerX + radius * Math.cos(angle) - width / 2
    const y = centerY + radius * Math.sin(angle) - height / 2
    
    if (canFitAt(x, y, width, height, placedRects)) {
      return { x, y, width, height }
    }
    
    angle += angleStep
    radius += radiusStep * (angleStep / (2 * Math.PI))
  }
  
  // Fall back to grid search
  for (let x = 0; x <= 800 - width; x += 20) {
    for (let y = 0; y <= 800 - height; y += 20) {
      if (canFitAt(x, y, width, height, placedRects)) {
        return { x, y, width, height }
      }
    }
  }
  
  // Last resort: place with minimal overlap
  let bestX = 0
  let bestY = 0
  let minOverlap = Infinity
  
  for (let x = 0; x <= 800 - width; x += 10) {
    for (let y = 0; y <= 800 - height; y += 10) {
      let totalOverlap = 0
      
      for (const rect of placedRects) {
        const overlapX = Math.max(0, Math.min(x + width, rect.x + rect.width) - Math.max(x, rect.x))
        const overlapY = Math.max(0, Math.min(y + height, rect.y + rect.height) - Math.max(y, rect.y))
        totalOverlap += overlapX * overlapY
      }
      
      if (totalOverlap < minOverlap) {
        minOverlap = totalOverlap
        bestX = x
        bestY = y
      }
    }
  }
  
  return { x: bestX, y: bestY, width, height }
}

// Create the word cloud layout
export const createWordCloudLayout = (games: GameData[]): PositionedGame[] => {
  const sortedGames = [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  const positioned: PositionedGame[] = []
  const placedRects: Array<{x: number, y: number, width: number, height: number}> = []
  
  for (const game of sortedGames) {
    const baseSize = getBaseSize(game.rating, games.length)
    const width = baseSize
    const height = baseSize
    
    const position = findBestPosition(width, height, placedRects)
    
    positioned.push({
      game,
      x: position.x,
      y: position.y,
      width: position.width,
      height: position.height
    })
    
    placedRects.push({
      x: position.x,
      y: position.y,
      width: position.width,
      height: position.height
    })
  }
  
  return positioned
}

// Function to get object-position for specific games
export const getObjectPosition = (gameSlug: string) => {
  switch (gameSlug) {
    case 'outer-wilds':
      return '50% 25%' // Move up more to hide text at bottom
    case 'state-of-decay':
      return '50% 20%' // Move towards top of image
    case 'anatomy':
      return '50% 50%' // Center, but we'll use object-contain instead
    case 'smash-bros':
      return '50% 30%' // Zoom in on Wii U Smash Bros image
    default:
      return '50% 50%' // Center
  }
} 