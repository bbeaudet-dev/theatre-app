'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { sectionConfig, Section } from '../lib/config/sections'

export function DesktopNav() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isSubNavVisible, setIsSubNavVisible] = useState(false)
  const [forFunPosition, setForFunPosition] = useState(0)
  const navRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isActive = (href?: string) => {
    if (!href) return false
    // Special case for resume - exact match only
    if (href === '/portfolio/resume') {
      return pathname === href
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  const isParentActive = (item: Section) => {
    if (item.href) {
      // Special case for "for fun" - check if we're on any of its child pages
      if (item.id === 'for-fun') {
        return pathname.startsWith('/for-fun')
      }
      return isActive(item.href)
    }
    if (item.children) {
      return item.children.some(child => isActive(child.href))
    }
    return false
  }

  // Check if we should show sub-navigation
  const shouldShowSubNav = () => {
    return pathname.startsWith('/for-fun') || hoveredItem === 'for-fun' || isSubNavVisible
  }

  // Calculate position of the "for fun" nav item
  const calculateForFunPosition = () => {
    if (navRef.current) {
      const navItems = navRef.current.querySelectorAll('[data-nav-item]')
      let currentPosition = 0
      for (let i = 0; i < navItems.length; i++) {
        const item = navItems[i] as HTMLElement
        if (item.getAttribute('data-nav-item') === 'for-fun') {
          // Add a small offset to account for padding
          return currentPosition + 8
        }
        currentPosition += item.offsetWidth
      }
    }
    return 0
  }

  // Handle mouse enter for main nav items
  const handleMouseEnter = (itemId: string) => {
    setHoveredItem(itemId)
    if (itemId === 'for-fun') {
      setIsSubNavVisible(true)
      setForFunPosition(calculateForFunPosition())
    } else {
      // Hide subnav when hovering over other nav items
      setIsSubNavVisible(false)
    }
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // Handle mouse leave for the entire nav area
  const handleMouseLeave = () => {
    // Immediate disappearance for more natural feel
    setHoveredItem(null)
    setIsSubNavVisible(false)
  }

  // Handle mouse enter for the sub-nav area
  const handleSubNavMouseEnter = () => {
    // Keep sub-nav visible when hovering over it
    setIsSubNavVisible(true)
  }

  // Calculate position on mount and pathname changes
  useEffect(() => {
    if (shouldShowSubNav()) {
      setForFunPosition(calculateForFunPosition())
    }
  }, [pathname])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const forFunSection = sectionConfig.sections.find(section => section.id === 'for-fun')

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        ref={navRef}
        className="hidden md:flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
        id="nav"
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-row space-x-0 pr-10">
          {sectionConfig.sections.map((item) => {
            const isItemActive = isParentActive(item)
            
            return (
              <div
                key={item.id}
                data-nav-item={item.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.id)}
              >
                <Link
                  href={item.href || '/for-fun'}
                  className={`transition-all duration-200 hover:text-neutral-800 dark:hover:text-neutral-200 hover:scale-105 flex align-middle relative  px-2 m-1 ${
                    isItemActive 
                      ? 'font-bold text-neutral-800 dark:text-neutral-200 text-lg' 
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            )
          })}
        </div>
      </nav>

      {/* Desktop Sub Navigation - Absolute positioned to prevent content bumping */}
      <div 
        className={`hidden md:block transition-all duration-200 ease-in-out overflow-hidden absolute top-full left-0 right-0 ${
          shouldShowSubNav() ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'
        }`}
        onMouseEnter={handleSubNavMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative mt-0">
          <div 
            className="flex flex-row space-x-0 pr-10"
            style={{ marginLeft: `${forFunPosition}px` }}
          >
            {forFunSection?.children?.map((child) => {
              const isChildActive = isActive(child.href)
              
              return (
                <Link
                  key={child.href}
                  href={child.href!}
                  className={`transition-all duration-200 hover:text-neutral-800 dark:hover:text-neutral-200 hover:scale-105 flex align-middle relative py-1 px-2 m-1 text-sm ${
                    isChildActive 
                      ? 'font-bold text-neutral-800 dark:text-neutral-200' 
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {child.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
} 