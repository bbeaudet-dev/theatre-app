'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getShowRank, getTotalShows, formatRank, getShowBySlug, getShowDistrict } from 'app/for-fun/theatre/utils'
import TheatreCloud from 'app/components/TheatreCloud'
import { theatreShowList } from './data/shows-ben'
import { theatreShowListRose } from './data/shows-rose'
import { theatreShowListSophia } from './data/shows-sophia'

interface TheatreClientProps {
  reviews: any[]
}

function formatDate(dateString: string, includeYear: boolean = true): string {
  const date = new Date(dateString)
  if (includeYear) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TheatreClient({ reviews }: TheatreClientProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const allReviews = reviews.sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold relative z-10">Showbiz, Baby</h1>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        My rankings, reviews, and thoughts on shows and the magic of theatre
      </p>
      
      {/* Story text above all clouds */}
      <div className="prose prose-neutral dark:prose-invert mb-8">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          My first trip to New York City (in 2022) was with my then-fiancee Sophia and her friend Rose. Despite living in the city with the second-largest theatre district (Cleveland's Playhouse Square), it was this trip that truly unlocked the magic of theatre for me.
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
            I didn't even *anticipate* liking Broadway shows very much - in fact, I primarily was in town to play in a squash tournament and watch the Tournament of Champions at Grand Central Terminal. So while the two of them went ["show-maxxing"](/blog/show-maxxing) (a term we apparently coined), I spent most of the weekend playing and watching squash. Eventually I went with them to see POTUS and I was hooked from there. We have Rose to thank for the introduction.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Since then, my wife and I have indulged in many show-maxxing weekends in the big city, and we began paying attention to the theatre scene in Cleveland, which happens to be quite good as well.  
            </p>
          </>
        )}
      </div>

      {/* Ben's cloud */}
      <div className="mb-2">
        <TheatreCloud shows={theatreShowList} />
      </div>

      {/* Rose's cloud - on its own row */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-center">Rose</h2>
        <div className="flex justify-center">
          <TheatreCloud shows={theatreShowListRose} showFilters={false} />
        </div>
      </div>

      {/* Sophia's cloud */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-center">Sophia</h2>
        <div className="flex justify-center">
          <TheatreCloud shows={theatreShowListSophia} showFilters={false} />
        </div>
      </div>
    </section>
  )
} 