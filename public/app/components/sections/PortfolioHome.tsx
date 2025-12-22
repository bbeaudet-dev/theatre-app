import { getPortfolioProjects } from '../../portfolio/utils'

export interface PortfolioItem {
  title: string
  href: string
  tags?: string[]
  date: string
  summary: string
}

export function PortfolioHome() {
  const allProjects = getPortfolioProjects()
  
  // Sort projects by date (newest first)
  const sortedProjects = allProjects.sort((a, b) => {
    const aDate = new Date(a.metadata.completedAt || '1900-01-01')
    const bDate = new Date(b.metadata.completedAt || '1900-01-01')
    return bDate.getTime() - aDate.getTime()
  })

  const portfolioItems: PortfolioItem[] = sortedProjects.map(project => ({
    title: project.metadata.title,
    href: `/portfolio/${project.slug}`,
    tags: project.metadata.tags,
    date: project.metadata.completedAt,
    summary: project.metadata.summary,
  }))

  return { portfolioItems }
} 