import { getBlogPosts } from '../../blog/utils'

export interface BlogItem {
  title: string
  href: string
  tags?: string[]
  collection?: string
  date: string
  summary: string
}

export function BlogHome() {
  const allBlogs = getBlogPosts()
  
  // Sort blog posts by date (newest first)
  const sortedBlogs = allBlogs.sort((a, b) => {
    const aDate = new Date(a.metadata.publishedAt || '1900-01-01')
    const bDate = new Date(b.metadata.publishedAt || '1900-01-01')
    return bDate.getTime() - aDate.getTime()
  })

  const blogItems: BlogItem[] = sortedBlogs.map(post => ({
    title: post.metadata.title,
    href: `/blog/${post.slug}`,
    tags: post.metadata.tags || [],
    collection: post.metadata.collection,
    date: post.metadata.publishedAt,
    summary: post.metadata.summary,
  }))

  return { blogItems }
} 