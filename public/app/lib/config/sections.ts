export interface Section {
  id: string
  name: string
  href?: string
  description: string
  icon?: string
  children?: Section[]
}

export interface SectionConfig {
  sections: Section[]
}

export const sectionConfig: SectionConfig = {
  sections: [
    {
      id: 'home',
      name: 'home',
      href: '/',
      description: 'Welcome to my personal website',
    },
    {
      id: 'portfolio',
      name: 'portfolio',
      href: '/portfolio',
      description: 'My software engineering and mechanical engineering projects',
    },
    {
      id: 'resume',
      name: 'resume',
      href: '/portfolio/resume',
      description: 'Professional resume and experience',
    },
    {
      id: 'blog',
      name: 'blog',
      href: '/blog',
      description: 'Thoughts, reflections, and technical writing',
    },
    {
      id: 'for-fun',
      name: 'for fun',
      href: '/for-fun/theatre',
      description: 'Hobbies, entertainment, and personal interests',
      children: [
        {
          id: 'theatre',
          name: 'theatre',
          href: '/for-fun/theatre',
          description: 'Broadway show reviews and theatrical experiences',
        },
        {
          id: 'games',
          name: 'games',
          href: '/for-fun/games',
          description: 'My favorite games, achievements, and gaming experiences',
        },
      ],
    },
    // {
    //   id: 'about',
    //   name: 'about',
    //   href: '/about',
    //   description: 'Learn more about Ben Beaudet',
    // },
  ],
}

// Helper functions
export function getSectionById(id: string): Section | undefined {
  return sectionConfig.sections.find(section => section.id === id)
}

export function getForFunSections(): Section[] {
  const forFunSection = getSectionById('for-fun')
  return forFunSection?.children || []
}

export function getAllSections(): Section[] {
  return sectionConfig.sections
}

export function getTopLevelSections(): Section[] {
  return sectionConfig.sections.filter(section => !section.children)
} 