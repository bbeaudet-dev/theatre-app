import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt?: string
  date?: string
  summary: string
  image?: string
  tags?: string[]
  collection?: string
  [key: string]: any
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  
  if (!match) {
    // If no frontmatter found, return empty metadata
    return { metadata: {} as Metadata, content: fileContent.trim() }
  }
  
  let frontMatterBlock = match[1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    if (line.trim() && line.includes(': ')) {
      let [key, ...valueArr] = line.split(': ')
      let value = valueArr.join(': ').trim()
      
      // Handle tags array specially
      if (key.trim() === 'tags') {
        try {
          // Remove outer quotes if present
          const cleanValue = value.replace(/^['"](.*)['"]$/, '$1')
          // Parse as JSON array
          const parsedTags = JSON.parse(cleanValue)
          metadata[key.trim() as keyof Metadata] = Array.isArray(parsedTags) ? parsedTags : [parsedTags]
        } catch {
          // Fallback to comma-separated parsing
          const cleanValue = value.replace(/^['"](.*)['"]$/, '$1')
          metadata[key.trim() as keyof Metadata] = cleanValue.split(',').map(tag => tag.trim().replace(/^['"](.*)['"]$/, '$1'))
        }
      } else {
        value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
        metadata[key.trim() as keyof Metadata] = value
      }
    }
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getBlogPosts() {
  const mainPosts = getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
  
  const allPosts = mainPosts.map(post => ({
    ...post,
    metadata: {
      ...post.metadata,
      publishedAt: post.metadata.publishedAt || post.metadata.date || new Date().toISOString()
    }
  }))
  
  return allPosts
}

export function formatDate(date: string | undefined, includeRelative = false) {
  if (!date) {
    return ''
  }

  // Ensure the date is interpreted in UTC
  let targetDate = new Date(date + 'T00:00:00Z')
  let currentDate = new Date()

  let months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  let month = months[targetDate.getUTCMonth()]
  let day = targetDate.getUTCDate()
  let year = targetDate.getUTCFullYear()

  let formattedDate = `${month} ${day}, ${year}`

  if (includeRelative) {
    const diffInDays = Math.floor(
      (currentDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffInDays === 0) {
      return 'Today'
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30)
      return `${months} ${months === 1 ? 'month' : 'months'} ago`
    } else {
      const years = Math.floor(diffInDays / 365)
      return `${years} ${years === 1 ? 'year' : 'years'} ago`
    }
  }

  return formattedDate
}
