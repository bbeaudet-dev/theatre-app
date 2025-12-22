import { ContentListHomeResponsive } from 'app/components/ContentListHomeResponsive'
import { Introduction } from 'app/components/Introduction'
import { getPortfolioProjects } from 'app/portfolio/utils'
import { getBlogPosts } from 'app/blog/utils'

export default function Page() {
  // Fetch data from each section
  const portfolioProjects = getPortfolioProjects().sort((a, b) => {
    const aDate = new Date(a.metadata.completedAt || '1900-01-01')
    const bDate = new Date(b.metadata.completedAt || '1900-01-01')
    return bDate.getTime() - aDate.getTime() // Newest first
  }).slice(0, 9)

  const blogPosts = getBlogPosts().sort((a, b) => {
    const aDate = new Date(a.metadata.publishedAt || '1900-01-01')
    const bDate = new Date(b.metadata.publishedAt || '1900-01-01')
    return bDate.getTime() - aDate.getTime() // Newest first
  }).slice(0, 9)

  return (
    <div className="overflow-x-hidden">
      <Introduction />
      
      {/* Section lists */}
      <section className="w-full max-w-screen-2xl mx-auto px-4">
        <ContentListHomeResponsive 
          title={
            <div className="flex items-center gap-2">
              <span>Portfolio</span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 font-normal">
                (<a href="/portfolio/resume" className="underline hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">resume</a>)
              </span>
            </div>
          }
          items={portfolioProjects.map((project) => ({
            date: project.metadata.completedAt,
            title: project.metadata.title,
            href: `/portfolio/${project.slug}`,
            tags: project.metadata.tags,
            image: project.metadata.image,
            summary: project.metadata.summary,
          }))}
          viewAllHref="/portfolio"
          viewAllText="see all Projects"
          variant="compact"
        />
        <ContentListHomeResponsive 
          title="Blog Posts"
          items={blogPosts.map((post) => ({
            date: post.metadata.publishedAt,
            title: post.metadata.title,
            href: `/blog/${post.slug}`,
            tags: post.metadata.tags || [],
            collection: post.metadata.collection,
          }))}
          viewAllHref="/blog"
          viewAllText="see all Posts"
          variant="compact"
        />
      </section>
    </div>
  )
}
