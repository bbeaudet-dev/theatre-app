import { type GameData } from 'app/for-fun/games/utils'

interface RelatedGameContentProps {
  game: GameData
}

export default function RelatedGameContent({ game }: RelatedGameContentProps) {
  const hasRelatedContent = game.blogPosts?.length || 
                           game.portfolioProjects?.length || 
                           game.other?.length || 
                           game.series?.length ||
                           game.achievements?.length

  if (!hasRelatedContent) {
    return null
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-800 dark:text-gray-200">Related Content:</h4>
      
      {game.achievements?.map((achievement, index) => (
        <div key={index} className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            🏆 {achievement.title}
          </span>
          {achievement.description && (
            <span className="text-gray-500 dark:text-gray-500 ml-2">
              - {achievement.description}
            </span>
          )}
        </div>
      ))}
      
      {game.series?.map((gameItem, index) => (
        <div key={index} className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            🎮 {gameItem.title}
            {gameItem.platform && (
              <span className="text-gray-500 dark:text-gray-500 ml-2">
                ({gameItem.platform})
              </span>
            )}
          </span>
        </div>
      ))}
      
      {game.blogPosts?.map((post) => (
        <div key={post.slug} className="text-sm">
          <a 
            href={`/blog/${post.slug}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            📝 {post.title}
          </a>
        </div>
      ))}
      
      {game.portfolioProjects?.map((project) => (
        <div key={project.slug} className="text-sm">
          <a 
            href={`/portfolio/${project.slug}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            💼 {project.title}
          </a>
        </div>
      ))}
      
      {game.other?.map((link, index) => (
        <div key={index} className="text-sm">
          <a 
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            🔗 {link.title}
          </a>
        </div>
      ))}
    </div>
  )
} 