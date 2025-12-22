import Link from 'next/link'
import { Badge } from './ui/badge'
import { getBadgeVariant } from './utils'
import { getRelativeDate } from '../lib/date-utils'

interface ContentListHomeResponsiveProps {
  title: string | React.ReactNode
  viewAllHref?: string
  viewAllText?: string
  variant?: 'compact' | 'detailed'
  showViewAll?: boolean
  items: Array<{
    date?: string
    title: string
    href: string
    tags?: string[]
    summary?: string
    collection?: string
    image?: string
  }>
}

export function ContentListHomeResponsive({ 
  title, 
  viewAllHref, 
  viewAllText = "See all",
  variant = 'detailed',
  showViewAll = true,
  items
}: ContentListHomeResponsiveProps) {

  if (variant === 'compact') {
    return (
      <div className="mb-12">
        <div className={`flex items-center ${showViewAll ? 'justify-between' : 'justify-start'} mb-4`}>
          <h2 className="text-xl font-semibold">{title}</h2>
          {showViewAll && viewAllHref && (
            <Link 
              href={viewAllHref}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              {viewAllText} →
            </Link>
          )}
        </div>
        <div className={showViewAll ? "responsive-items" : "portfolio-items"}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <Link key={`item-${item.title}-${index}`} href={item.href} className="block group">
                <div 
                  className={`px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] flex flex-col justify-between relative overflow-hidden ${
                    item.image ? 'h-48' : 'h-32'
                  }`}
                  style={{
                    backgroundImage: item.image ? `url(${item.image})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: item.title === "Corrupted Phone Game" ? 'center top' : 
                                       item.title === "AI ChatBot" ? 'center 30%' : 
                                       item.title === "AI Smart Mirror" ? 'right center' : 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Background overlay for better text readability */}
                  {item.image && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]"></div>
                  )}
                  
                  {/* Content with proper z-index */}
                  <div className={`flex flex-col h-full ${item.image ? 'relative z-10' : ''}`}>
                    <div className="flex flex-col gap-1 mb-2">
                      <h3 className={`font-medium transition-colors text-sm ${
                        item.image 
                          ? 'text-white group-hover:text-neutral-200 drop-shadow-lg' 
                          : 'text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400'
                      }`}>
                        {item.title}
                      </h3>
                      {item.tags && Array.isArray(item.tags) && (
                        <div className="flex items-center gap-1">
                          {item.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant={getBadgeVariant(item.collection, tag)} className={`text-[8px] flex-shrink-0 ${
                              item.image 
                                ? 'bg-white/20 text-white border-white/30 backdrop-blur-sm' 
                                : ''
                            }`}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {item.summary && (
                      <p className={`text-xs flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        item.image 
                          ? 'text-neutral-200 drop-shadow-lg' 
                          : 'text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {item.summary}
                      </p>
                    )}
                    {item.date && (
                      <span className={`text-xs mt-auto text-right ${
                        item.image 
                          ? 'text-neutral-300 drop-shadow-lg' 
                          : 'text-neutral-400 dark:text-neutral-500'
                      }`}>
                        {getRelativeDate(item.date)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {showViewAll && viewAllHref && (
          <div className="flex justify-center mt-6">
            <Link 
              href={viewAllHref}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              {viewAllText} →
            </Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mb-12">
      <div className={`flex items-center ${showViewAll ? 'justify-between' : 'justify-start'} mb-4`}>
        <h2 className="text-xl font-semibold">{title}</h2>
        {showViewAll && viewAllHref && (
          <Link 
            href={viewAllHref}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            {viewAllText} →
          </Link>
        )}
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <Link key={`item-${item.title}-${index}`} href={item.href} className="block group">
            <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors text-sm mb-1">
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.summary}
                    </p>
                  )}
                  {item.tags && (
                    <div className="flex items-center gap-2">
                      {item.tags && Array.isArray(item.tags) && item.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant={getBadgeVariant(item.collection, tag)} className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {item.date && (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap ml-3">
                    {getRelativeDate(item.date)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {showViewAll && viewAllHref && (
        <div className="flex justify-center mt-6">
          <Link 
            href={viewAllHref}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            {viewAllText} →
          </Link>
        </div>
      )}
    </div>
  )
} 