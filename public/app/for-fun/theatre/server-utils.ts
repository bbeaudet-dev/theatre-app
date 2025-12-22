import fs from 'fs'
import path from 'path'

type Rating = {
  emotionalResonance: number
  engagement: number
  orchestration: number
  choreography: number
  wowFactor: number
}

type TheatreMetadata = {
  title: string
  publishedAt?: string
  date?: string
  summary: string
  image?: string
  rating: Rating
  showName: string
  theater?: string
  dateSeen?: string
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let frontmatterMatch = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = frontmatterMatch![1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let metadata: Partial<TheatreMetadata> = {}

  let frontMatterLines = frontMatterBlock.trim().split('\n')
  frontMatterLines.forEach((line) => {
    if (line.trim()) {
      let [key, ...valueArr] = line.split(': ')
      let value = valueArr.join(': ').trim()
      value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
      
      if (key.trim() === 'rating') {
        // Parse rating object
        try {
          metadata.rating = JSON.parse(value)
        } catch {
          metadata.rating = {
            emotionalResonance: 0,
            engagement: 0,
            orchestration: 0,
            choreography: 0,
            wowFactor: 0
          }
        }
      } else {
        (metadata as any)[key.trim()] = value
      }
    }
  })

  return { metadata: metadata as TheatreMetadata, content }
}

function getMDXFiles(dir) {
  try {
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} does not exist, returning empty array`);
      return [];
    }
    return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
  } catch (error) {
    console.log(`Error reading directory ${dir}:`, error);
    return [];
  }
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir) {
  try {
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
  } catch (error) {
    console.log(`Error getting MDX data from ${dir}:`, error);
    return [];
  }
}

export function getTheatreReviews() {
  const mainReviews = getMDXData(path.join(process.cwd(), 'app', 'for-fun', 'theatre', 'reviews'))
  
  const allReviews = mainReviews.map(review => {
    return {
      ...review,
      metadata: {
        ...review.metadata,
        publishedAt: review.metadata.publishedAt || review.metadata.date || new Date().toISOString(),
        rating: review.metadata.rating || {
          emotionalResonance: 0,
          engagement: 0,
          orchestration: 0,
          choreography: 0,
          wowFactor: 0
        }
      }
    }
  })
  
  return allReviews;
}

export function calculateAverageRating(rating: Rating): number {
  const values = Object.values(rating)
  return values.reduce((sum, val) => sum + val, 0) / values.length
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