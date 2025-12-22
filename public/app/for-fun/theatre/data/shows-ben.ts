export interface TheatreShow {
  // Core show info
  id: number // Unique show ID (0 = first unique show added, 1 = second unique show added, etc.)
  slug: string
  name: string
  rank: number // 1 = best, higher numbers = lower rank
  
  // Visits information
  visits: VisitInfo[]
  
  // Media
  images: string[]
  
  // Related content (for future use)
  reviews?: Array<{
    title: string
    slug: string
  }>
  blogPosts?: Array<{
    title: string
    slug: string
  }>
  other?: Array<{
    title: string
    url: string
  }>
}

export interface VisitInfo {
  chronologicalId: number // Overall chronological order (0 = first show ever seen, 1 = second show ever seen, etc.)
  visitId: number // 0 for first visit to this show, 1 for second, etc.
  date: string
  theatre: string
  district: 'Broadway' | 'Playhouse Square' | 'West End' | 'Off-Broadway' | 'Local' | 'Touring' | 'Other'
  notes?: string // Optional notes about the visit (cast, special circumstances, etc.)
}

export const theatreShowList: TheatreShow[] = [
  { 
    id: 0,
    slug: "hadestown",
    name: "Hadestown", 
    rank: 1,
    visits: [
      { chronologicalId: 23, visitId: 0, theatre: "Connor Palace", date: "2024-12-15", district: "Playhouse Square" },
      { chronologicalId: 25, visitId: 1, theatre: "Walter Kerr Theatre", date: "2025-01-20", district: "Broadway" },
      { chronologicalId: 34, visitId: 2, theatre: "Walter Kerr Theatre", date: "2025-07-06", district: "Broadway" }
    ],
    images: ['/images-theatre/hadestown.jpg']
  },
  { 
    id: 1,
    slug: "hamilton",
    name: "Hamilton", 
    rank: 2,
    visits: [
      { chronologicalId: 7, visitId: 0, theatre: "Keybank State Theatre", date: "2024-01-15", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/hamilton.jpg']
  },
  { 
    id: 2,
    slug: "come-from-away",
    name: "Come From Away", 
    rank: 8,
    visits: [
      { chronologicalId: 10, visitId: 0, theatre: "Connor Palace", date: "2024-08-13", district: "Playhouse Square" },
      { chronologicalId: 26, visitId: 1, theatre: "Detroit Fisher Theatre", date: "2025-02-15", district: "Touring" }
    ],
    images: ['/images-theatre/come-from-away.jpg']
  },
  { 
    id: 3,
    slug: "john-proctor-is-the-villain",
    name: "John Proctor is the Villain", 
    rank: 9,
    visits: [
      { chronologicalId: 37, visitId: 0, theatre: "Booth Theatre", date: "2025-08-02", district: "Broadway" },
      { chronologicalId: 40, visitId: 1, theatre: "Booth Theatre", date: "2025-08-09", district: "Broadway" }
    ],
    images: ['/images-theatre/john-proctor.jpg']
  },
  { 
    id: 4,
    slug: "gypsy",
    name: "Gypsy", 
    rank: 13,
    visits: [
      { chronologicalId: 33, visitId: 0, theatre: "Majestic Theatre", date: "2025-06-28", district: "Broadway" }
    ],
    images: ['/images-theatre/gypsy.jpg']
  },
  { 
    id: 5,
    slug: "water-for-elephants",
    name: "Water for Elephants", 
    rank: 10,
    visits: [
      { chronologicalId: 9, visitId: 0, theatre: "Imperial Theatre", date: "2024-08-03", district: "Broadway" }
    ],
    images: ['/images-theatre/water-for-elephants.jpg']
  },
  { 
    id: 6,
    slug: "death-becomes-her",
    name: "Death Becomes Her", 
    rank: 4,
    visits: [
      { chronologicalId: 38, visitId: 0, theatre: "Lunt-Fontanne Theatre", date: "2025-08-03", district: "Broadway", notes: "Main Viola, backup Stefan" },
      { chronologicalId: 39, visitId: 1, theatre: "Lunt-Fontanne Theatre", date: "2025-08-08", district: "Broadway", notes: "Main Stefan, backup Viola" }
    ],
    images: ['/images-theatre/death-becomes-her.jpg']
  },
  { 
    id: 7,
    slug: "sunset-blvd",
    name: "Sunset Blvd.", 
    rank: 14,
    visits: [
      { chronologicalId: 24, visitId: 0, theatre: "St. James Theatre", date: "2024-12-20", district: "Broadway" }
    ],
    images: ['/images-theatre/sunset-blvd.jpg']
  },
  { 
    id: 8,
    slug: "the-outsiders",
    name: "The Outsiders", 
    rank: 22,
    visits: [
      { chronologicalId: 12, visitId: 0, theatre: "Bernard B. Jacobs Theatre", date: "2024-09-19", district: "Broadway" }
    ],
    images: ['/images-theatre/the-outsiders.jpg']
  },
  { 
    id: 9,
    slug: "floyd-collins",
    name: "Floyd Collins", 
    rank: 25,
    visits: [
      { chronologicalId: 31, visitId: 0, theatre: "Vivian Beaumont Theatre", date: "2025-06-20", district: "Broadway" }
    ],
    images: ['/images-theatre/floyd-collins.jpg']
  },
  { 
    id: 10,
    slug: "moulin-rouge",
    name: "Moulin Rouge", 
    rank: 16,
    visits: [
      { chronologicalId: 4, visitId: 0, theatre: "Al Hirschfeld Theatre", date: "2023-01-29", district: "Broadway" }
    ],
    images: ['/images-theatre/moulin-rouge.jpg']
  },
  { 
    id: 11,
    slug: "wicked",
    name: "Wicked", 
    rank: 17,
    visits: [
      { chronologicalId: 3, visitId: 0, theatre: "Gershwin Theatre", date: "2023-01-28", district: "Broadway" }
    ],
    images: ['/images-theatre/wicked.jpg']
  },
  { 
    id: 12,
    slug: "potus",
    name: "POTUS", 
    rank: 19,
    visits: [
      { chronologicalId: 1, visitId: 0, theatre: "Shubert Theatre", date: "2022-05-01", district: "Broadway" }
    ],
    images: ['/images-theatre/potus.jpg']
  },
  { 
    id: 13,
    slug: "job",
    name: "Job", 
    rank: 15,
    visits: [
      { chronologicalId: 8, visitId: 0, theatre: "Hayes Theatre", date: "2024-08-02", district: "Broadway" }
    ],
    images: ['/images-theatre/job.jpg']
  },
  { 
    id: 14,
    slug: "les-miserables",
    name: "Les Misérables", 
    rank: 11,
    visits: [
      { chronologicalId: 13, visitId: 0, theatre: "Connor Palace", date: "2024-09-19", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/les-miserables.jpg']
  },
  { 
    id: 15,
    slug: "call-me-izzy",
    name: "Call Me Izzy", 
    rank: 30,
    visits: [
      { chronologicalId: 32, visitId: 0, theatre: "Studio 54", date: "2025-06-22", district: "Broadway" }
    ],
    images: ['/images-theatre/call-me-izzy.jpg']
  },
  { 
    id: 16,
    slug: "some-like-it-hot",
    name: "Some Like It Hot", 
    rank: 20,
    visits: [
      { chronologicalId: 18, visitId: 0, theatre: "Connor Palace", date: "2024-11-10", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/some-like-it-hot.jpg']
  },
  { 
    id: 17,
    slug: "hells-kitchen",
    name: "Hell's Kitchen", 
    rank: 31,
    visits: [
      { chronologicalId: 21, visitId: 0, theatre: "Shubert Theatre", date: "2024-12-05", district: "Broadway" }
    ],
    images: ['/images-theatre/hells-kitchen.jpg']
  },
  { 
    id: 18,
    slug: "parade",
    name: "Parade", 
    rank: 33,
    visits: [
      { chronologicalId: 20, visitId: 0, theatre: "Connor Palace", date: "2024-11-20", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/parade.jpg']
  },
  { 
    id: 19,
    slug: "the-last-5-years",
    name: "The Last 5 Years", 
    rank: 35,
    visits: [
      { chronologicalId: 29, visitId: 0, theatre: "Hudson Theatre", date: "2025-06-01", district: "Broadway" }
    ],
    images: ['/images-theatre/the-last-5-years.jpg']
  },
  { 
    id: 20,
    slug: "the-great-gatsby",
    name: "The Great Gatsby", 
    rank: 29,
    visits: [
      { chronologicalId: 16, visitId: 0, theatre: "Broadway Theatre", date: "2024-10-15", district: "Broadway" }
    ],
    images: ['/images-theatre/great-gatsby.jpg']
  },
  { 
    id: 21,
    slug: "fiddler-on-the-roof",
    name: "Fiddler on the Roof", 
    rank: 38,
    visits: [
      { chronologicalId: 28, visitId: 0, theatre: "Allen Theatre", date: "2025-05-13", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/fiddler-on-the-roof.jpg']
  },
  { 
    id: 22,
    slug: "shucked",
    name: "Shucked", 
    rank: 49,
    visits: [
      { chronologicalId: 19, visitId: 0, theatre: "Connor Palace", date: "2024-11-15", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/shucked.jpg']
  },
  { 
    id: 23,
    slug: "life-of-pi",
    name: "Life of Pi", 
    rank: 34,
    visits: [
      { chronologicalId: 22, visitId: 0, theatre: "Connor Palace", date: "2024-12-10", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/life-of-pi.jpg']
  },
  { 
    id: 24,
    slug: "in-the-heights",
    name: "In the Heights", 
    rank: 39,
    visits: [
      { chronologicalId: 17, visitId: 0, theatre: "Connor Palace", date: "2024-10-20", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/in-the-heights.jpg']
  },
  { 
    id: 25,
    slug: "pride-prejudice",
    name: "Pride & Prejudice", 
    rank: 43,
    visits: [
      { chronologicalId: 14, visitId: 0, theatre: "Connor Palace", date: "2024-09-25", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/pride-and-prejudice.webp']
  },
  { 
    id: 26,
    slug: "dead-outlaw",
    name: "Dead Outlaw", 
    rank: 36,
    visits: [
      { chronologicalId: 30, visitId: 0, theatre: "Audible Theatre", date: "2025-06-15", district: "Broadway" }
    ],
    images: ['/images-theatre/dead-outlaw.jpg'],
    reviews: [
      { title: "Dead Outlaw", slug: "dead-outlaw" }
    ]
  },
  { 
    id: 27,
    slug: "dear-evan-hansen",
    name: "Dear Evan Hansen", 
    rank: 42,
    visits: [
      { chronologicalId: 5, visitId: 0, theatre: "Connor Palace", date: "2023-05-17", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/dear-evan-hansen.jpg'],
    reviews: [
      { title: "Dear Evan Hansen", slug: "dear-evan-hansen" }
    ]
  },
  { 
    id: 28,
    slug: "and-juliet",
    name: "& Juliet", 
    rank: 50,
    visits: [
      { chronologicalId: 27, visitId: 0, theatre: "Connor Palace", date: "2025-03-06", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/and-juliet.jpg'],
    reviews: [
      { title: "& Juliet", slug: "and-juliet" }
    ]
  },
  { 
    id: 29,
    slug: "harry-potter-cursed-child",
    name: "Harry Potter and the Cursed Child", 
    rank: 48,
    visits: [
      { chronologicalId: 15, visitId: 0, theatre: "Lyric Theatre", date: "2024-09-25", district: "Broadway" }
    ],
    images: ['/images-theatre/harry-potter-cursed-child.jpg']
  },
  { 
    id: 30,
    slug: "a-strange-loop",
    name: "A Strange Loop", 
    rank: 41,
    visits: [
      { chronologicalId: 6, visitId: 0, theatre: "Lyceum Theatre", date: "2023-08-20", district: "Broadway" }
    ],
    images: ['/images-theatre/a-strange-loop.jpg'],
    reviews: [
      { title: "A Strange Loop", slug: "a-strange-loop" }
    ]
  },
  { 
    id: 31,
    slug: "book-of-mormon",
    name: "Book of Mormon", 
    rank: 40,
    visits: [
      { chronologicalId: 2, visitId: 0, theatre: "Eugene O'Neill Theatre", date: "2023-01-27", district: "Broadway" }
    ],
    images: ['/images-theatre/book-of-mormon.jpg'],
    reviews: [
      { title: "Book of Mormon", slug: "book-of-mormon" }
    ]
  },
  { 
    id: 32,
    slug: "lord-nil-seven-deadly-sins",
    name: "Lord Nil: Seven Deadly Sins", 
    rank: 56,
    visits: [
      { chronologicalId: 36, visitId: 0, theatre: "Stage 42", date: "2025-08-01", district: "Off-Broadway" }
    ],
    images: ['/images-theatre/lord-nil.jpg']
  },
  { 
    id: 33,
    slug: "stranger-things-first-shadow",
    name: "Stranger Things: The First Shadow", 
    rank: 52,
    visits: [
      { chronologicalId: 35, visitId: 0, theatre: "Marquis Theatre", date: "2025-07-18", district: "Broadway" }
    ],
    images: ['/images-theatre/stranger-things.jpg'],
    reviews: [
      { title: "Stranger Things: The First Shadow", slug: "stranger-things-first-shadow" }
    ]
  },
  { 
    id: 34,
    slug: "company",
    name: "Company", 
    rank: 54,
    visits: [
      { chronologicalId: 0, visitId: 0, theatre: "Bernard B. Jacobs Theatre", date: "2022-04-30", district: "Broadway" }
    ],
    images: ['/images-theatre/company.jpg'],
    reviews: [
      { title: "Company", slug: "company" }
    ]
  },
  { 
    id: 35,
    slug: "six",
    name: "Six", 
    rank: 55,
    visits: [
      { chronologicalId: 11, visitId: 0, theatre: "Connor Palace", date: "2024-09-05", district: "Playhouse Square" }
    ],
    images: ['/images-theatre/six.jpg'],
    reviews: [
      { title: "Six", slug: "six" }
    ]
  },
  { 
    id: 36,
    slug: "cabaret",
    name: "Cabaret", 
    rank: 37,
    visits: [
      { chronologicalId: 41, visitId: 0, theatre: "August Wilson Theatre", date: "2025-08-09", district: "Broadway" }
    ],
    images: ['/images-theatre/cabaret.jpg']
  },
  { 
    id: 37,
    slug: "maybe-happy-ending",
    name: "Maybe Happy Ending", 
    rank: 3,
    visits: [
      { chronologicalId: 42, visitId: 0, theatre: "Belasco Theatre", date: "2025-08-10", district: "Broadway" }
    ],
    images: ['/images-theatre/maybe-happy-ending.jpg']
  },
  { 
    id: 38,
    slug: "operation-mincemeat",
    name: "Operation Mincemeat", 
    rank: 6,
    visits: [
      { chronologicalId: 43, visitId: 0, theatre: "Golden Theatre", date: "2025-08-15", district: "Broadway" },
      { chronologicalId: 52, visitId: 1, theatre: "Golden Theatre", date: "2025-10-14", district: "Broadway" },
      { chronologicalId: 60, visitId: 2, theatre: "Golden Theatre", date: "2025-12-06", district: "Broadway" }
    ],
    images: ['/images-theatre/operation-mincemeat.jpg'],
    reviews: [
      { title: "Operation Mincemeat", slug: "operation-mincemeat" }
    ]
  },
  { 
    id: 39,
    slug: "play-that-goes-wrong",
    name: "Play That Goes Wrong", 
    rank: 24,
    visits: [
      { chronologicalId: 44, visitId: 0, theatre: "New World Stages", date: "2025-08-17", district: "Off-Broadway" }
    ],
    images: ['/images-theatre/play-that-goes-wrong.jpg']
  },
  { 
    id: 40,
    slug: "ginger-twinsies",
    name: "Ginger Twinsies", 
    rank: 32,
    visits: [
      { chronologicalId: 45, visitId: 0, theatre: "Orpheum Theatre", date: "2025-08-23", district: "Off-Broadway" }
    ],
    images: ['/images-theatre/ginger-twinsies.jpg']
  },
  { 
    id: 41,
    slug: "chicago",
    name: "Chicago", 
    rank: 28,
    visits: [
      { chronologicalId: 46, visitId: 0, theatre: "Ambassador Theatre", date: "2025-08-24", district: "Broadway" }
    ],
    images: ['/images-theatre/chicago.jpg']
  },
  { 
    id: 42,
    slug: "mexodus",
    name: "Mexodus", 
    rank: 5,
    visits: [
      { chronologicalId: 51, visitId: 0, theatre: "Minetta Lane Theatre", date: "2025-10-13", district: "Off-Broadway" },
      { chronologicalId: 53, visitId: 1, theatre: "Minetta Lane Theatre", date: "2025-10-15", district: "Off-Broadway" }
    ],
    images: ['/images-theatre/mexodus.webp']
  },
  { 
    id: 43,
    slug: "punch",
    name: "Punch", 
    rank: 12,
    visits: [
      { chronologicalId: 48, visitId: 0, theatre: "Samuel J. Friedman Theatre", date: "2025-10-11", district: "Broadway" }
    ],
    images: ['/images-theatre/punch.jpg']
  },
  { 
    id: 44,
    slug: "little-shop-of-horrors",
    name: "Little Shop of Horrors", 
    rank: 27,
    visits: [
      { chronologicalId: 47, visitId: 0, theatre: "Westside Theatre", date: "2025-08-30", district: "Off-Broadway" }
    ],
    images: ['/images-theatre/little-shop-of-horrors.jpg']
  },
  { 
    id: 45,
    slug: "mamma-mia",
    name: "Mamma Mia!", 
    rank: 21,
    visits: [
      { chronologicalId: 50, visitId: 0, theatre: "Winter Garden Theatre", date: "2025-10-12", district: "Broadway" }
    ],
    images: ['/images-theatre/mamma-mia.jpg']
  },
  { 
    id: 46,
    slug: "tartuffe",
    name: "Tartuffe", 
    rank: 53,
    visits: [
      { chronologicalId: 49, visitId: 0, theatre: "House of the Redeemer", date: "2025-10-12", district: "Off-Broadway" }
    ],
    images: ['/images-theatre/tartuffe.webp']
  },
  { 
    id: 47,
    slug: "rent",
    name: "RENT", 
    rank: 26,
    visits: [
      { chronologicalId: 55, visitId: 0, theatre: "Columbus Performing Arts Center (CPAC)", date: "2025-11-07", district: "Local" }
    ],
    images: ['/images-theatre/rent.webp']
  },
  { 
    id: 48,
    slug: "pen-pals",
    name: "Pen Pals", 
    rank: 45,
    visits: [
      { chronologicalId: 56, visitId: 0, theatre: "DR2 Theatre", date: "2025-11-30", district: "Off-Broadway" }
    ],
    images: ['/images-theatre/pen-pals.jpg']
  },
  { 
    id: 49,
    slug: "marjorie-prime",
    name: "Marjorie Prime", 
    rank: 47,
    visits: [
      { chronologicalId: 57, visitId: 0, theatre: "Hayes Theater", date: "2025-11-29", district: "Broadway" }
    ],
    images: ['/images-theatre/marjorie-prime.jpg']
  },
  { 
    id: 50,
    slug: "waiting-for-godot",
    name: "Waiting For Godot", 
    rank: 18,
    visits: [
      { chronologicalId: 58, visitId: 0, theatre: "Hudson Theatre", date: "2025-12-03", district: "Broadway" }
    ],
    images: ['/images-theatre/waiting-for-godot.jpg']
  },
  { 
    id: 51,
    slug: "chess",
    name: "Chess", 
    rank: 23,
    visits: [
      { chronologicalId: 59, visitId: 0, theatre: "Imperial Theatre", date: "2025-12-05", district: "Broadway" }
    ],
    images: ['/images-theatre/chess.jpg'],
    reviews: [
      { title: "Chess", slug: "chess" }
    ]
  },
  { 
    id: 52,
    slug: "two-strangers",
    name: "Two Strangers (Carry a Cake Across New York)", 
    rank: 7,
    visits: [
      { chronologicalId: 61, visitId: 0, theatre: "Longacre Theatre", date: "2025-12-06", district: "Broadway" }
    ],
    images: ['/images-theatre/two-strangers.jpg']
  },
  { 
    id: 53,
    slug: "oh-mary",
    name: "Oh, Mary!", 
    rank: 51,
    visits: [
      { chronologicalId: 62, visitId: 0, theatre: "Lyceum Theatre", date: "2025-12-07", district: "Broadway" }
    ],
    images: ['/images-theatre/oh-mary.jpg']
  },
  { 
    id: 54,
    slug: "rockettes-christmas-spectacular",
    name: "Rockettes Christmas Spectacular", 
    rank: 44,
    visits: [
      { chronologicalId: 63, visitId: 0, theatre: "Radio City Music Hall", date: "2025-12-07", district: "Broadway" }
    ],
    images: ['/images-theatre/rockettes-christmas-spectacular.webp']
  },
  { 
    id: 55,
    slug: "rocky-horror",
    name: "The Rocky Horror Show", 
    rank: 46,
    visits: [
      { chronologicalId: 54, visitId: 0, theatre: "Garden Theatre", date: "2025-10-25", district: "Local" }
    ],
    images: ['/images-theatre/rocky-horror.png']
  }
]; 