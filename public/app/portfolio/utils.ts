import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  completedAt?: string
  duration?: string
  summary: string
  image?: string
  technologies?: string
  githubUrl?: string
  liveUrl?: string
  tags?: string[]
  [key: string]: any
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  
  if (!match) {
    // If no frontmatter found, return empty metadata
    return { 
      metadata: {
        title: 'Untitled Project',
        summary: '',
        completedAt: new Date().toISOString()
      } as Metadata, 
      content: fileContent.trim() 
    }
  }
  
  let frontMatterBlock = match[1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    
    // Handle tags array specially
    if (key.trim() === 'tags') {
      // Parse array format like ["tag1", "tag2"] or ["tag1", "tag2"]
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

export function getPortfolioProjects() {
  return getMDXData(path.join(process.cwd(), 'app', 'portfolio', 'projects')).map(project => ({
    ...project,
    metadata: {
      ...project.metadata,
      completedAt: project.metadata.completedAt || new Date().toISOString()
    }
  }))
} 