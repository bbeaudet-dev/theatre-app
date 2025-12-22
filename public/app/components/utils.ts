import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

// Map collection to badge variant
export function getBadgeVariant(collection?: string, tag?: string) {
  // Check for project-specific tags first
  if (tag) {
    const normalizedTag = tag.toLowerCase();
    switch (normalizedTag) {
      // Status tags
      case 'published':
        return 'published'
      case 'deployed':
        return 'deployed'
      case 'finished':
        return 'finished'
      case 'in-progress':
        return 'in-progress'
      case 'experiment':
        return 'experiment'
      
      // Project type tags
      case 'software':
        return 'software'
      case 'firmware':
        return 'firmware'
      case 'mechanical':
        return 'mechanical'
      case 'game dev':
        return 'game-dev'
      case 'gaming':
        return 'gaming'
      case 'ai':
        return 'ai'
      
      // Theatre district tags
      case 'broadway':
        return 'broadway'
      case 'playhouse square':
        return 'playhouse-square'
      case 'broadway (touring)':
        return 'broadway-touring'
      case 'theatre':
        return 'theatre'
      // Fractal tags
      case 'fractal':
      case 'fractal 1':
      case 'fractal 2':
      case 'fractal 3':
      case 'fractal 4':
      case 'fractal 5':
      case 'fractal 6':
        return 'fractal'
      // If it's not a project tag, fall through to collection logic
    }
  }
  
  // Fall back to collection-based logic for blog posts
  if (!collection) return 'secondary'
  switch (collection) {
    case 'fractal-weekly-reflection':
      return 'fractal'
    case 'beginner-programmer':
      return 'beginner-programmer'
    default:
      return 'secondary'
  }
} 