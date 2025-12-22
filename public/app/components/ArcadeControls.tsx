'use client'

import { useState, useEffect } from 'react'

export default function ArcadeControls() {
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [leftButtonPressed, setLeftButtonPressed] = useState(false)
  const [rightButtonPressed, setRightButtonPressed] = useState(false)
  const [lastMouseMove, setLastMouseMove] = useState(Date.now())

  // Joystick movement based on mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setLastMouseMove(Date.now())
      
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      // Calculate distance from center (normalized to -1 to 1)
      const deltaX = (e.clientX - centerX) / centerX
      const deltaY = (e.clientY - centerY) / centerY
      
      // Limit joystick movement to a circle
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const maxDistance = 1.2 // Allow movement up to 120% of screen distance
      
      if (distance > maxDistance) {
        const angle = Math.atan2(deltaY, deltaX)
        setJoystickPosition({
          x: Math.cos(angle) * maxDistance,
          y: Math.sin(angle) * maxDistance
        })
      } else {
        setJoystickPosition({ x: deltaX, y: deltaY })
      }
    }

    // Return to center when mouse stops moving
    const returnToCenter = () => {
      const timeSinceLastMove = Date.now() - lastMouseMove
      if (timeSinceLastMove > 250) { // Return to center after 250ms of no movement 
        setJoystickPosition({ x: 0, y: 0 })
      }
    }

    const centerInterval = setInterval(returnToCenter, 50) // Check every 50ms

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(centerInterval)
    }
  }, [lastMouseMove])

  // Button press effects
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click
        setLeftButtonPressed(true)
        setTimeout(() => setLeftButtonPressed(false), 200) // Increased from 150ms to 200ms
      } else if (e.button === 2) { // Right click
        setRightButtonPressed(true)
        setTimeout(() => setRightButtonPressed(false), 200) // Increased from 150ms to 200ms
      }
    }

    const handleContextMenu = (e: Event) => {
      e.preventDefault() // Prevent context menu on right click
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('contextmenu', handleContextMenu)
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Joystick - Bottom Right */}
      <div className="absolute bottom-8 right-8 pointer-events-none">
        <div className="relative w-24 h-24"> {/* Increased from w-20 h-20 to w-24 h-24 */}
          {/* Joystick base */}
          <div className="absolute inset-0 bg-gray-800/80 rounded-full border-4 border-gray-600/80 shadow-lg"> {/* Added transparency */}
            <div className="absolute inset-2 bg-gray-700/80 rounded-full"></div>
          </div>
          
          {/* Joystick stick */}
          <div 
            className="absolute w-12 h-12 bg-red-500/80 rounded-full border-2 border-red-600/80 shadow-lg transition-transform duration-1000 ease-out" /* Increased from w-10 h-10 to w-12 h-12 (20% bigger) */
            style={{
              transform: `translate(${joystickPosition.x * 50}px, ${joystickPosition.y * 50}px)`, /* Much larger multiplier: 50px -> 80px */
              left: '50%',
              top: '50%',
              marginLeft: '-24px', /* Adjusted for new size: -20px -> -24px */
              marginTop: '-24px' /* Adjusted for new size: -20px -> -24px */
            }}
          >
            <div className="absolute inset-1 bg-red-400/80 rounded-full"></div>
          </div>
          
          {/* Joystick center dot */}
          <div className="absolute w-2 h-2 bg-gray-300/80 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Arcade Buttons - Bottom Left */}
      <div className="absolute bottom-8 left-8 pointer-events-none">
        <div className="relative"> {/* Container for proper positioning */}
          {/* Left Button */}
          <div className="absolute left-0 top-0"> {/* Absolute positioning */}
            <div className={`w-16 h-16 rounded-full border-4 border-red-700/80 shadow-lg transition-all duration-100 ${
              leftButtonPressed ? 'transform scale-90 bg-red-500/80 shadow-xl' : 'bg-red-600/80' /* Added transparency */
            }`}> {/* Increased from w-12 h-12 to w-16 h-16 */}
              <div className={`absolute inset-2 rounded-full transition-colors duration-100 ${
                leftButtonPressed ? 'bg-red-400/80' : 'bg-red-500/80'
              }`}></div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/80 to-red-600/80 opacity-30"></div>
          </div>

          {/* Right Button */}
          <div className="absolute left-20 top-4"> {/* Offset down and to the right for staggered effect */}
            <div className={`w-16 h-16 rounded-full border-4 border-red-700/80 shadow-lg transition-all duration-100 ${
              rightButtonPressed ? 'transform scale-90 bg-red-500/80 shadow-xl' : 'bg-red-600/80' /* Added transparency */
            }`}> {/* Increased from w-12 h-12 to w-16 h-16 */}
              <div className={`absolute inset-2 rounded-full transition-colors duration-100 ${
                rightButtonPressed ? 'bg-red-400/80' : 'bg-red-500/80'
              }`}></div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/80 to-red-600/80 opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 