interface LaunchButtonProps {
  href: string
  title: string
  description?: string
  icon?: string
  color?: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'yellow' | 'pink'
  openInNewTab?: boolean
}

const colorVariants = {
  blue: 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25',
  green: 'bg-green-600 hover:bg-green-700 hover:shadow-green-500/25', 
  purple: 'bg-purple-600 hover:bg-purple-700 hover:shadow-purple-500/25',
  red: 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/25',
  orange: 'bg-orange-600 hover:bg-orange-700 hover:shadow-orange-500/25',
  yellow: 'bg-yellow-600 hover:bg-yellow-700 hover:shadow-yellow-500/25',
  pink: 'bg-pink-600 hover:bg-pink-700 hover:shadow-pink-500/25'
}

export function LaunchButton({ 
  href, 
  title, 
  description,
  icon = '🚀',
  color = 'blue',
  openInNewTab = true 
}: LaunchButtonProps) {
  const linkProps = openInNewTab ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {}

  return (
    <div className="mb-6 text-center">
      <a
        href={href}
        {...linkProps}
        className={`inline-block px-6 py-3 ${colorVariants[color]} text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl`}
      >
        {icon} {title}
      </a>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {description}
        </p>
      )}
    </div>
  )
} 