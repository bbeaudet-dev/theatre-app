export const metadata = {
  title: "Music",
  description: 'My music collection, vinyl records, piano playing, and musical experiences.',
}

export default function MusicPage() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Music</h1>
      
      <div className="mb-8">
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Music has been a constant companion throughout my life. From collecting vinyl records to playing piano, 
          discovering new artists to experiencing live performances, this section celebrates my love for music 
          in all its forms.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold text-xl mb-4">Music Corner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for music content */}
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <h3 className="font-medium mb-2">Vinyl Collection</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              My growing collection of vinyl records, from classic albums to modern releases. 
              Each record tells a story.
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                Collection
              </span>
            </div>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <h3 className="font-medium mb-2">Piano</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              My journey with piano playing, favorite pieces, and the joy of making music.
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                Performance
              </span>
            </div>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <h3 className="font-medium mb-2">Playlists</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Curated playlists for different moods and occasions, with stories behind each one.
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                Curation
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold text-xl mb-4">Coming Soon</h2>
        <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
          <li>• Vinyl collection showcase and reviews</li>
          <li>• Piano performances and sheet music</li>
          <li>• Artist spotlights and album reviews</li>
          <li>• Concert experiences and live music stories</li>
          <li>• Apple Music playlist links and curation</li>
        </ul>
      </div>
    </section>
  )
} 