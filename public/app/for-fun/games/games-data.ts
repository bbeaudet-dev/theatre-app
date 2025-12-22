import { type GameData } from './utils'

export const gamesData: GameData[] = [
  {
    // Balatro
    rating: 9, periods: ['adult'], slug: 'balatro', title: 'Balatro',
    series: [{ title: 'Balatro', platform: 'Mobile' }],
    images: ['/images-games/balatro.avif'],
    blogPosts: [{ title: 'The Completionist', slug: 'completionist' }], portfolioProjects: [{ title: 'Balatro Sticker Tracker', slug: 'balatro-sticker-tracker' }],
    achievements: [{ title: '31/31 Achievements', description: 'All 31 Vanilla Achievements'}, { title: 'Unseeded Naneinfs', description: '2 successful unseeded naneinfs (no mods, no legendaries)' }]
  },
  {
    // Outer Wilds
    rating: 10, periods: ['adult'], slug: 'outer-wilds', title: 'Outer Wilds',
    series: [{ title: 'Outer Wilds', platform: 'Switch' }],
    images: ['/images-games/outer-wilds2.webp']
  },
  {
    // Undertale
    rating: 9, periods: ['adult'], slug: 'undertale', title: 'Undertale',
    series: [{ title: 'Undertale', platform: 'Switch' }],
    images: ['/images-games/undertale3.jpg'],
    achievements: [{ title: 'All Endings', description: 'Completed the Neutral, Pacifist, and Genocide routes' }]
  },
  {
    // Deltarune
    rating: 4, periods: ['adult'], slug: 'deltarune', title: 'Deltarune',
    series: [{ title: 'Deltarune', platform: 'Switch' }],
    images: ['/images-games/deltarune.jpg']
  },
  {
    // Hollow Knight
    rating: 10, periods: ['adult'], slug: 'hollow-knight', title: 'Hollow Knight',
    series: [{ title: 'Hollow Knight', platform: 'Switch' }],
    images: ['/images-games/hollow-knight.jpg'],
    achievements: [{ title: '112% Completion', description: 'Achieved full game completion' }, { title: 'Steel Soul', description: 'Completed Steel Soul mode' }]
  },
  {
    // Inside
    rating: 3, periods: ['adult'], slug: 'inside', title: 'Inside',
    series: [{ title: 'Inside', platform: 'Switch' }],
    images: ['/images-games/inside.avif']
  },
  {
    // Papers, Please
    rating: 3, periods: ['adult'], slug: 'papers-please', title: 'Papers, Please',
    series: [{ title: 'Papers, Please', platform: 'PC' }],
    images: ['/images-games/papers-please.jpg']
  },
  {
    // Iron Lung
    rating: 2, periods: ['adult'], slug: 'iron-lung', title: 'Iron Lung',
    series: [{ title: 'Iron Lung', platform: 'PC' }],
    images: ['/images-games/iron-lung.avif']
  },
  {
    // Menagerie Series
    rating: 5, periods: ['adult'], slug: 'menagerie', title: 'Menagerie Series',
    series: [{ title: 'Presentable Liberty', platform: 'PC' }, { title: 'Exoptable Money', platform: 'PC' }, { title: 'Archive', platform: 'PC' }],
    images: ['/images-games/presentable-liberty.jpg', '/images-games/menagerie-archive.jpg', '/images-games/exoptable-money.webp'],
    other: [{ title: 'This Game Will CHANGE YOUR LIFE - Markiplier', url: 'https://www.youtube.com/watch?v=jZTQPTQovZA' }]
  },
  {
    // State of Decay
    rating: 3, periods: ['teenager'], slug: 'state-of-decay', title: 'State of Decay',
    series: [{ title: 'State of Decay', platform: 'Xbox 360' }],
    images: ['/images-games/state-of-decay.jpg']
  },
  {
    // Castle Crashers
    rating: 3, periods: ['teenager'], slug: 'castle-crashers', title: 'Castle Crashers',
    series: [{ title: 'Castle Crashers', platform: 'Switch' }],
    images: ['/images-games/castle-crashers.avif'],
    achievements: [{ title: '23/30 Characters Unlocked', description: '' }]
  },
  {
    // Minecraft
    rating: 8, periods: ['teenager', 'childhood'], slug: 'minecraft', title: 'Minecraft',
    series: [{ title: 'Minecraft', platform: 'PC' }],
    images: ['/images-games/minecraft.webp']
  },
  {
    // The Elder Scrolls V: Skyrim
    rating: 7, periods: ['teenager'], slug: 'skyrim', title: 'The Elder Scrolls V: Skyrim',
    series: [{ title: 'The Elder Scrolls V: Skyrim', platform: 'Switch' }],
    images: ['/images-games/skyrim.jpg'],
    blogPosts: [{ title: 'The Completionist', slug: 'completionist' }]
  },
  {
    // Pokemon ROM Hacks
    rating: 5, periods: ['teenager', 'adult'], slug: 'pokemon-rom-hacks', title: 'Pokemon ROM Hacks',
    series: [{ title: 'Pokemon XG: NeXt Gen', platform: 'PC' }, { title: 'Pokemon Uranium', platform: 'PC' }, { title: 'Pokemon Light Platinum', platform: 'PC' }, { title: 'Pokemon Radical Red', platform: 'PC' }, { title: 'Pokemon Blaze Black 2 Redux', platform: 'PC' }, { title: 'Pokemon Unbound', platform: 'PC' }],
    images: ['/images-games/pokemon-xg-nextgen.jpg', '/images-games/pokemon-uranium.webp', '/images-games/pokemon-radical-red.jpg', '/images-games/pokemon-blaze-black-2-redux.png', '/images-games/pokemon-unbound.webp', '/images-games/pokemon-light-platinum.webp'],
  },
  {
    // Pokemon Emerald/Ruby/Sapphire
    rating: 7, periods: ['childhood'], slug: 'pokemon-emerald', title: 'Pokemon Emerald/Ruby/Sapphire',
    series: [{ title: 'Pokemon Emerald', platform: 'Game Boy Advance' }, { title: 'Pokemon Ruby', platform: 'Game Boy Advance' }, { title: 'Pokemon Sapphire', platform: 'Game Boy Advance' }],
    images: ['/images-games/pokemon-emerald.jpg', '/images-games/pokemon-ruby.jpg', '/images-games/pokemon-sapphire.jpg']
  },
  {
    // Pokemon Platinum/Diamond/Pearl
    rating: 5, periods: ['childhood'], slug: 'pokemon-platinum', title: 'Pokemon Platinum/Diamond/Pearl',
    series: [{ title: 'Pokemon Platinum', platform: 'DS' }, { title: 'Pokemon Diamond', platform: 'DS' }, { title: 'Pokemon Pearl', platform: 'DS' }],
    images: ['/images-games/pokemon-platinum.png', '/images-games/pokemon-diamond.jpg', '/images-games/pokemon-pearl.jpg'],
    achievements: [{ title: 'National Dex', description: 'Completed the National Pokedex' }]
  },
  {
    // Pokemon Colosseum/XD Gale of Darkness
    rating: 8, periods: ['childhood'], slug: 'pokemon-colosseum', title: 'Pokemon Colosseum/XD Gale of Darkness',
    series: [{ title: 'Pokemon Colosseum', platform: 'GameCube' }, { title: 'Pokemon XD: Gale of Darkness', platform: 'GameCube' }],
    images: ['/images-games/pokemon-colosseum.jpeg', '/images-games/pokemon-gale-of-darkness.jpg']
  },
  {
    // Pokemon FireRed/LeafGreen
    rating: 3, periods: ['childhood'], slug: 'pokemon-firered', title: 'Pokemon FireRed/LeafGreen',
    series: [{ title: 'Pokemon FireRed', platform: 'Game Boy Advance' }, { title: 'Pokemon LeafGreen', platform: 'Game Boy Advance' }],
    images: ['/images-games/pokemon-firered.jpg', '/images-games/pokemon-leafgreen.jpg']
  },
  {
    // Pokemon HeartGold/SoulSilver
    rating: 4, periods: ['childhood'], slug: 'pokemon-heartgold', title: 'Pokemon HeartGold/SoulSilver',
    series: [{ title: 'Pokemon HeartGold', platform: 'DS' }, { title: 'Pokemon SoulSilver', platform: 'DS' }],
    images: ['/images-games/pokemon-soulsilver.jpg', '/images-games/pokemon-heartgold.jpg']
  },
  {
    // Pokemon Mystery Dungeon
    rating: 6, periods: ['childhood'], slug: 'pokemon-mystery-dungeon', title: 'Pokemon Mystery Dungeon',
    series: [{ title: 'Pokemon Mystery Dungeon: Red Rescue Team', platform: 'Game Boy Advance' }, { title: 'Pokemon Mystery Dungeon: Blue Rescue Team', platform: 'DS' }, { title: 'Pokemon Mystery Dungeon: Explorers of Sky', platform: 'DS' }, { title: 'Pokemon Mystery Dungeon: Explorers of Time', platform: 'DS' }, { title: 'Pokemon Mystery Dungeon: Rescue Team DX', platform: 'Switch' }],
    images: ['/images-games/pokemon-mystery-dungeon-blue.avif', '/images-games/pokemon-mystery-dungeon-sky.jpg']
  },
  {
    // Pokemon Black/White
    rating: 2, periods: ['childhood'], slug: 'pokemon-black-white', title: 'Pokemon Black/White',
    series: [{ title: 'Pokemon Black', platform: 'DS' }, { title: 'Pokemon White', platform: 'DS' }],
    images: ['/images-games/pokemon-black.avif', '/images-games/pokemon-white.avif']
  },
  {
    // Spyro the Dragon Series
    rating: 6, periods: ['childhood'], slug: 'spyro-series', title: 'Spyro the Dragon Series',
    series: [{ title: 'Spyro the Dragon', platform: 'PlayStation' }, { title: 'Spyro 2: Ripto\'s Rage', platform: 'PlayStation' }, { title: 'Spyro 3: Year of the Dragon', platform: 'PlayStation' }, {title: 'Spyro: Season of Flame', platform: 'Game Boy Advance' }, { title: 'Spyro: Attack of the Rhynocs', platform: 'Game Boy Advance' }, { title: 'Spyro: Enter the Dragonfly', platform: 'GameCube' }, { title: 'Spyro Orange', platform: 'Game Boy Advance' }, { title: 'Spyro: A Hero\'s Tail', platform: 'GameCube' }, { title: 'Spyro: A New Beginning', platform: 'GameCube' }, { title: 'Spyro Reignited Trilogy', platform: 'Switch' }],
    images: ['/images-games/spyro-the-dragon.jpg', '/images-games/spyro-2-riptos-rage.png', '/images-games/spyro-year-of-the-dragon.png', '/images-games/spyro-a-heros-tail.webp', '/images-games/spyro-a-new-beginning.jpg', '/images-games/spyro-attack-of-the-rhynocs.jpg', '/images-games/spyro-enter-the-dragonfly.jpg', '/images-games/spyro-orange.webp', '/images-games/spyro-season-of-flame.jpeg', '/images-games/spyro-reignited-trilogy.jpeg'],
    blogPosts: [{ title: 'The Completionist', slug: 'completionist' }],
    achievements: [{ title: 'Reignited Trilogy 100%', description: '100% completion' }]
  },
  {
    // Super Smash Bros Series
    rating: 7, periods: ['childhood','teenager','adult'], slug: 'smash-bros', title: 'Super Smash Bros Series',
    series: [{ title: 'Super Smash Bros.', platform: 'Nintendo 64' }, { title: 'Super Smash Bros. Melee', platform: 'GameCube' }, { title: 'Super Smash Bros. Brawl', platform: 'Wii' }, { title: 'Super Smash Bros. for Nintendo 3DS', platform: 'Nintendo 3DS' }, { title: 'Super Smash Bros. for Wii U', platform: 'Wii U' }, { title: 'Super Smash Bros. Ultimate', platform: 'Switch' }],
    images: ['/images-games/smash-melee.jpg', '/images-games/smash-brawl.jpg', '/images-games/smash-wiiu.jpeg', '/images-games/smash-bros-ultimate.avif']
  },
  {
    // Luigi's Mansion
    rating: 5, periods: ['childhood'], slug: 'luigis-mansion', title: 'Luigi\'s Mansion',
    series: [{ title: 'Luigi\'s Mansion', platform: 'GameCube' }, { title: 'Luigi\'s Mansion 3', platform: 'Switch' }],
    images: ['/images-games/luigis-mansion.jpg', '/images-games/luigis-mansion-3.jpg']
  },
  {
    // Anatomy
    rating: 3, periods: ['adult'], slug: 'anatomy', title: 'Anatomy',
    series: [{ title: 'Anatomy', platform: 'PC' }],
    images: ['/images-games/anatomy.jpg']
  },
  {
    // Stardew Valley
    rating: 2, periods: ['adult'], slug: 'stardew-valley', title: 'Stardew Valley',
    series: [{ title: 'Stardew Valley', platform: 'PC' }],
    images: ['/images-games/stardew-valley.jpeg']
  },
  {
    // Animal Crossing Series
    rating: 4, periods: ['childhood'], slug: 'animal-crossing', title: 'Animal Crossing Series',
    series: [{ title: 'Animal Crossing: Wild World', platform: 'DS' }, { title: 'Animal Crossing: New Horizons', platform: 'Switch' }],
    images: ['/images-games/animal-crossing-wild-world.png', '/images-games/animal-crossing-new-horizons.jpg']
  },
  {
    // Kingdom Hearts Series
    rating: 5, periods: ['childhood'], slug: 'kingdom-hearts', title: 'Kingdom Hearts Series',
    series: [{ title: 'Kingdom Hearts', platform: 'PlayStation 2' }],
    images: ['/images-games/kingdom-hearts.jpeg']
  },
  {
    // Katamari Damacy
    rating: 5, periods: ['childhood'], slug: 'katamari', title: 'Katamari Damacy',
    series: [{ title: 'We Love Katamari', platform: 'PlayStation 2' }],
    images: ['/images-games/we-love-katamari.jpg']
  },
  {
    // Sitting Ducks
    rating: 5, periods: ['childhood'], slug: 'sitting-ducks', title: 'Sitting Ducks',
    series: [{ title: 'Sitting Ducks', platform: 'Playstation 2' }],
    images: ['/images-games/sitting-ducks.jpg']
  },
  {
    // Firewatch
    rating: 7, periods: ['adult'], slug: 'firewatch', title: 'Firewatch',
    series: [{ title: 'Firewatch', platform: 'Switch' }],
    images: ['/images-games/firewatch3.jpg']
  },
  {
    // Factorio
    rating: 6, periods: ['adult'], slug: 'factorio', title: 'Factorio',
    series: [{ title: 'Factorio', platform: 'PC' }],
    images: ['/images-games/factorio.png']
  },
  {
    // Faster Than Light
    rating: 7, periods: ['adult'], slug: 'faster-than-light', title: 'Faster Than Light',
    series: [{ title: 'Faster Than Light', platform: 'PC' }],
    images: ['/images-games/ftl2.jpeg']
  },
  {
    // Opus Magnum
    rating: 7, periods: ['adult'], slug: 'opus-magnum', title: 'Opus Magnum',
    series: [{ title: 'Opus Magnum', platform: 'PC' }],
    images: ['/images-games/opus-magnum3.jpg'],
    achievements: [{ title: '100% Completion', description: 'Completed all puzzles' }]
  },
  {
    // Subnautica
    rating: 8, periods: ['adult'], slug: 'subnautica', title: 'Subnautica',
    series: [{ title: 'Subnautica', platform: 'Switch' }, { title: 'Subnautica: Below Zero', platform: 'Switch' }],
    images: ['/images-games/subnautica.jpg', '/images-games/subnautica-below-zero.avif']
  },
  {
    // Celeste
    rating: 9, periods: ['adult'], slug: 'celeste', title: 'Celeste',
    series: [{ title: 'Celeste', platform: 'Switch' }],
    images: ['/images-games/celeste.avif'],
    achievements: [{ title: '100% Completion', description: 'Completed all levels and collectibles' }, { title: 'Golden Strawberries', description: 'Working on collecting golden strawberries' }]
  },
  {
    // Keep Talking and Nobody Explodes
    rating: 4, periods: ['adult'], slug: 'keep-talking-and-nobody-explodes', title: 'Keep Talking and Nobody Explodes',
    series: [{ title: 'Keep Talking and Nobody Explodes', platform: 'PC' }],
    images: ['/images-games/keep-talking2.jpg']
  },
  {
    // Horizon Zero Dawn
    rating: 8, periods: ['adult'], slug: 'horizon-zero-dawn', title: 'Horizon Zero Dawn',
    series: [{ title: 'Horizon Zero Dawn', platform: 'PlayStation 4' }],
    images: ['/images-games/horizon-zero-dawn.jpg']
  },
  {
    // Plate Up!
    rating: 6, periods: ['adult'], slug: 'plate-up', title: 'Plate Up!',
    series: [{ title: 'Plate Up!', platform: 'PC' }],
    images: ['/images-games/plate-up.png']
  },
  {
    // A Way Out
    rating: 6, periods: ['adult'], slug: 'a-way-out', title: 'A Way Out',
    series: [{ title: 'A Way Out', platform: 'PC' }],
    images: ['/images-games/a-way-out.jpg']
  },
  {
    // Uncharted 4: A Thief's End
    rating: 3, periods: ['teenager'], slug: 'uncharted-4', title: 'Uncharted 4: A Thief\'s End',
    series: [{ title: 'Uncharted 4: A Thief\'s End', platform: 'PlayStation 4' }],
    images: ['/images-games/uncharted-4.webp']
  },
  {
    // Call of Duty Series
    rating: 4, periods: ['teenager'], slug: 'call-of-duty', title: 'Call of Duty Series',
    series: [{ title: 'Call of Duty: Modern Warfare 3', platform: 'PC' }, { title: 'Call of Duty: Black Ops', platform: 'PC' }, { title: 'Call of Duty: Black Ops 2', platform: 'PC' }, { title: 'Call of Duty: WWII', platform: 'PC' }],
    images: ['/images-games/cod-mw3.webp', '/images-games/cod-black-ops.png', '/images-games/cod-ww2.jpg']
  },
  {
    // Grand Theft Auto V
    rating: 3, periods: ['teenager'], slug: 'gta-v', title: 'Grand Theft Auto V',
    series: [{ title: 'Grand Theft Auto V', platform: 'Xbox 360' }],
    images: ['/images-games/gta-v.png']
  },
  {
    // The Legend of Zelda Series
    rating: 6, periods: ['childhood'], slug: 'zelda-series', title: 'The Legend of Zelda Series',
    series: [{ title: 'The Legend of Zelda: Twilight Princess', platform: 'GameCube' }, { title: 'The Legend of Zelda: Phantom Hourglass', platform: 'DS' }, { title: 'The Legend of Zelda: Spirit Tracks', platform: 'DS' }],
    images: ['/images-games/zelda-twilight-princess.jpg', '/images-games/zelda-phantom-hourglass.jpg', '/images-games/zelda-spirit-tracks.jpg']
  },
  {
    // Crash Bandicoot Series
    rating: 6, periods: ['childhood'], slug: 'crash-bandicoot', title: 'Crash Bandicoot Series',
    series: [{ title: 'Crash Team Racing', platform: 'PlayStation 2' }, { title: 'Crash Tag Team Racing', platform: 'PlayStation 2' }, { title: 'Crash Bash', platform: 'PlayStation' }],
    images: ['/images-games/crash-team-racing.png', '/images-games/crash-tag-team-racing.jpg', '/images-games/crash-bash.jpg']
  },
  {
    // Mario Baseball Series
    rating: 5, periods: ['childhood'], slug: 'mario-baseball', title: 'Mario Baseball Series',
    series: [{ title: 'Super Mario Sluggers', platform: 'GameCube' }, { title: 'Super Mario Baseball', platform: 'Wii' }],
    images: ['/images-games/super-sluggers.jpg', '/images-games/mario-superstar-baseball.jpg']
  },
  {
    // Mario Strikers Series
    rating: 5, periods: ['childhood'], slug: 'mario-strikers', title: 'Mario Strikers Series',
    series: [{ title: 'Super Mario Strikers', platform: 'GameCube' }, { title: 'Super Mario Strikers Charged', platform: 'Wii' }],
    images: ['/images-games/super-mario-strikers.jpg', '/images-games/mario-strikers-charged.jpg']
  },
  {
    // Mario Golf Series
    rating: 1, periods: ['childhood'], slug: 'mario-golf', title: 'Mario Golf Series',
    series: [{ title: 'Mario Golf: Toadstool Tour', platform: 'GameCube' }],
    images: ['/images-games/mario-golf-toadstool-tour.webp']
  },
  {
    // Mario & Luigi Series
    rating: 5, periods: ['childhood'], slug: 'mario-luigi-series', title: 'Mario & Luigi Series',
    series: [{ title: 'Mario & Luigi: Superstar Saga', platform: 'Game Boy Advance' }, { title: 'Mario & Luigi: Partners in Time', platform: 'DS' }, { title: 'Mario & Luigi: Bowser\'s Inside Story', platform: 'DS' }],
    images: ['/images-games/superstar-saga.jpg', '/images-games/partners-in-time.jpg', '/images-games/bowsers-inside-story.png']
  },
  {
    // Kirby Air Ride
    rating: 4, periods: ['childhood'], slug: 'kirby-air-ride', title: 'Kirby Air Ride',
    series: [{ title: 'Kirby Air Ride', platform: 'GameCube' }],
    images: ['/images-games/kirby-air-ride.jpg']
  },
  {
    // The Stanley Parable
    rating: 4, periods: ['adult'], slug: 'stanley-parable', title: 'The Stanley Parable',
    series: [{ title: 'The Stanley Parable', platform: 'Switch' }],
    images: ['/images-games/stanley-parable.jpg']
  }
] 