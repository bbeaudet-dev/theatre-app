'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Keyboard, Mousewheel, FreeMode } from 'swiper/modules'
import { Badge } from './ui/badge'
import { getBadgeVariant } from './utils'
import { ReactNode } from 'react'

// Simple date formatting function for client component
function formatDate(dateString: string | undefined): string {
  if (!dateString) return ''
  // Ensure the date is interpreted in UTC to match server-side formatting
  const date = new Date(dateString + 'T00:00:00Z')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
}

interface ContentCarouselProps {
  title: string | ReactNode
  items: Array<{
    title: string
    href: string
    tags?: string[]
    date?: string
    summary?: string
    collection?: string
    extra?: string
  }>
  type: 'portfolio' | 'blog' | 'theatre' | 'for-fun'
}

export function ContentCarousel({ title, items, type }: ContentCarouselProps) {
  // Parametrized sizing - change these values to adjust tooltip and card sizes
  const cardWidth = 'w-44' // 160px
  const tooltipWidth = 'w-36' // 144px - slightly skinnier than card
  const tooltipMargin = 'mb-3' // 12px margin between tooltip and card
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <a 
          href={type === 'portfolio' ? '/portfolio' : type === 'blog' ? '/blog' : type === 'for-fun' ? '/for-fun' : '/for-fun/theatre'}
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          See all →
        </a>
      </div>
      <div className="relative">
        <Swiper
          modules={[Navigation, Keyboard, Mousewheel, FreeMode]}
          spaceBetween={24}
          slidesPerView="auto"
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.5,
          }}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumRatio: 0.5,
            sticky: false,
          }}
          className="!overflow-visible"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <div className="group relative">
                <a
                  href={item.href}
                  className={`block p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 h-32 ${cardWidth}`}
                >
                  <div className="space-y-2 h-full flex flex-col">
                    {/* Date (for blog posts) */}
                    {type === 'blog' && item.date && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {formatDate(item.date)}
                      </span>
                    )}
                    
                    {/* Title */}
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors text-sm leading-tight">
                      {item.title}
                    </h3>
                    
                    {/* Summary for portfolio projects */}
                    {type === 'portfolio' && item.summary && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 overflow-hidden">
                        {item.summary}
                      </p>
                    )}
                    
                    {/* Summary for blog posts */}
                    {type === 'blog' && item.summary && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 overflow-hidden">
                        {item.summary}
                      </p>
                    )}
                    
                    {/* Ranking for theatre reviews */}
                    {type === 'theatre' && item.extra && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        {item.extra}
                      </p>
                    )}
                    
                    {/* Summary for theatre reviews */}
                    {type === 'theatre' && item.summary && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 overflow-hidden">
                        {item.summary}
                      </p>
                    )}
                    
                    {/* Tags for all types */}
                    {item.tags && item.tags.map((tag, index) => (
                      <Badge key={index} variant={getBadgeVariant(item.collection, tag)} className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
} 