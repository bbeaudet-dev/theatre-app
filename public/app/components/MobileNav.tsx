'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { sectionConfig, Section } from '../lib/config/sections'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()

  const isActive = (href?: string) => {
    if (!href) return false
    // Special case for resume - exact match only
    if (href === '/portfolio/resume') {
      return pathname === href
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  const isParentActive = (item: Section) => {
    if (item.href) return isActive(item.href)
    if (item.children) {
      return item.children.some(child => isActive(child.href))
    }
    return false
  }

  if (!isOpen) return null

  return (
    <div className="md:hidden mb-6 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
      <nav className="flex flex-col space-y-2">
        {sectionConfig.sections.map((item) => {
          const isItemActive = isParentActive(item)
          
          return (
            <div key={item.id}>
              <Link
                href={item.href || '/for-fun'}
                className={`block px-3 py-2 rounded transition-colors ${
                  isItemActive 
                    ? 'font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
                onClick={onClose}
              >
                {item.name}
              </Link>
              {item.children && isItemActive && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.children.map((child) => {
                    const isChildActive = isActive(child.href)
                    return (
                      <Link
                        key={child.href}
                        href={child.href!}
                        className={`block px-3 py-1 rounded text-sm transition-colors ${
                          isChildActive 
                            ? 'font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800' 
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                        }`}
                        onClick={onClose}
                      >
                        {child.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
} 