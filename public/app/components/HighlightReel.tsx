'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Keyboard, Mousewheel, FreeMode } from 'swiper/modules'
import { useState } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'

interface Highlight {
  id: string
  title: string
  description: string
  icon: string
}

interface HighlightElement {
  id: string
  title: string
  highlights: Highlight[]
}

const highlightElements: HighlightElement[] = [
  {
    id: '1',
    title: 'Software Engineering',
    highlights: [
      {
        id: '1',
        title: 'Full-Stack Development',
        description: 'React, Next.js, TypeScript, Node.js',
        icon: '💻'
      },
      {
        id: '2',
        title: 'AI Integration',
        description: 'Sora AI, Claude, ChatGPT, Cursor',
        icon: '🤖'
      },
    ]
  },
{
  id: '2',
  title: 'Game Development',
  highlights: [
    {
        id: '1',
        title: 'Core Defender',
        description: 'Deceptive puzzle game using phone sensors',
        icon: ''
    },
    {
        id: '2',
        title: 'Blob Game',
        description: 'Real-time multiplayer experience',
        icon: ''
    }
  ]
},
  {
    id: '3',
    title: 'Embedded Systems',
    highlights: [
      {
        id: '1',
        title: 'Brain-Computer Interfaces',
        description: 'Designed EEG sensor integration',
        icon: '🧠'
      },
      {
        id: '2',
        title: 'Smart Helmet Technology',
        description: 'Hardware and firmware integration',
        icon: '🪖'
      }
    ]
  },
  {
    id: '4',
    title: 'Mechanical Engineering',
    highlights: [
      {
        id: '1',
        title: 'Medical Devices',
        description: 'Design automation and 3D modeling',
        icon: '🏥'
      },
      {
        id: '2',
        title: 'Railroad Trackwork',
        description: 'Infrastructure and automation systems',
        icon: '🚂'
      }
    ]
  },
  {
    id: '5',
    title: 'Personality & Interests',
    highlights: [
      {
        id: '1',
        title: '33+ Broadway Shows',
        description: 'Passionate theatre-goer and reviewer',
        icon: '🎭'
      },
      {
        id: '2',
        title: 'Creative Projects',
        description: 'Logo design, game assets, video editing',
        icon: '🎨'
      }
    ]
  }
]

export function HighlightReel() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        modules={[Navigation, Keyboard, Mousewheel, FreeMode]}
        spaceBetween={16}
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
        className={`transition-all duration-300 ${
          isHovered ? 'h-44' : 'h-24'
        }`}
      >
        {highlightElements.map((element) => (
          <SwiperSlide key={element.id} className="!w-auto">
            <div className="group relative">
              <div className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 transition-all duration-300 ${
                isHovered ? 'h-40 w-64' : 'h-20 w-38'
              } hover:border-neutral-300 dark:hover:border-neutral-700`}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{element.highlights[0]?.icon || '📋'}</span>
                    <span className={`font-medium transition-all duration-300 ${
                      isHovered ? 'text-sm' : 'text-xs'
                    }`}>
                      {element.title}
                    </span>
                  </div>
                  
                  {isHovered && (
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-2">
                        {element.highlights.map((highlight) => (
                          <div key={highlight.id} className="text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <span>{highlight.icon}</span>
                              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                {highlight.title}
                              </span>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2 overflow-hidden">
                              {highlight.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
} 