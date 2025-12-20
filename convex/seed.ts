import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Seed function to create mock data for development
// This should be called manually during development
export const seedMockData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Create a mock user
    const userId = await ctx.db.insert("users", {
      name: "Test User",
      email: "test@example.com",
      createdAt: now,
      updatedAt: now,
    });

    // Helper to create a date timestamp
    const createDate = (year: number, month: number, day: number) => {
      return new Date(year, month - 1, day).getTime();
    };

    // Create mock shows
    const mockShows = [
      {
        title: "Hamilton",
        district: "broadway" as const,
        theatre: "Richard Rodgers Theatre",
        venue: "Richard Rodgers Theatre",
        description:
          "The revolutionary musical about Alexander Hamilton and the founding of America.",
        isOpenRun: true,
        isInPreviews: false,
        openingDate: createDate(2015, 8, 6),
        previewDate: createDate(2015, 7, 13),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: null,
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Wicked",
        district: "broadway" as const,
        theatre: "Gershwin Theatre",
        venue: "Gershwin Theatre",
        description:
          "The untold story of the witches of Oz, before Dorothy arrived.",
        isOpenRun: true,
        isInPreviews: false,
        openingDate: createDate(2003, 10, 30),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: "15:00",
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "The Lion King",
        district: "broadway" as const,
        theatre: "Minskoff Theatre",
        venue: "Minskoff Theatre",
        description:
          "The beloved Disney musical adaptation of the animated film.",
        isOpenRun: true,
        isInPreviews: false,
        openingDate: createDate(1997, 11, 13),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: "15:00",
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Hadestown",
        district: "broadway" as const,
        theatre: "Walter Kerr Theatre",
        venue: "Walter Kerr Theatre",
        description:
          "A folk opera retelling of the ancient Greek myth of Orpheus and Eurydice.",
        isOpenRun: true,
        isInPreviews: false,
        openingDate: createDate(2019, 4, 17),
        previewDate: createDate(2019, 3, 22),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: null,
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Moulin Rouge! The Musical",
        district: "broadway" as const,
        theatre: "Al Hirschfeld Theatre",
        venue: "Al Hirschfeld Theatre",
        description:
          "A spectacular musical adaptation of Baz Luhrmann's film, set in the bohemian world of Paris.",
        isOpenRun: true,
        isInPreviews: false,
        openingDate: createDate(2019, 7, 25),
        previewDate: createDate(2019, 6, 28),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: "15:00",
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Sweeney Todd",
        district: "broadway" as const,
        theatre: "Lunt-Fontanne Theatre",
        venue: "Lunt-Fontanne Theatre",
        description:
          "Stephen Sondheim's dark musical thriller about a vengeful barber.",
        isOpenRun: false,
        isInPreviews: false,
        openingDate: createDate(2023, 3, 26),
        previewDate: createDate(2023, 2, 26),
        closingDate: createDate(2024, 5, 5),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: null,
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "The Book of Mormon",
        district: "broadway" as const,
        theatre: "Eugene O'Neill Theatre",
        venue: "Eugene O'Neill Theatre",
        description:
          "A satirical musical comedy about two Mormon missionaries sent to Uganda.",
        isOpenRun: true,
        isInPreviews: false,
        openingDate: createDate(2011, 3, 24),
        previewDate: createDate(2011, 2, 24),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: "15:00",
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Come From Away",
        district: "broadway" as const,
        theatre: "Schoenfeld Theatre",
        venue: "Schoenfeld Theatre",
        description:
          "A heartwarming musical about the small town in Newfoundland that welcomed thousands of stranded passengers on 9/11.",
        isOpenRun: false,
        isInPreviews: false,
        openingDate: createDate(2017, 3, 12),
        previewDate: createDate(2017, 2, 18),
        closingDate: createDate(2022, 10, 2),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: null,
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Six",
        district: "broadway" as const,
        theatre: "Lena Horne Theatre",
        venue: "Lena Horne Theatre",
        description:
          "A modern pop musical about the six wives of Henry VIII, told as a pop concert.",
        isOpenRun: true,
        isInPreviews: false,
        openingDate: createDate(2021, 10, 3),
        previewDate: createDate(2021, 9, 17),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: "15:00",
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "The Outsiders",
        district: "broadway" as const,
        theatre: "Bernard B. Jacobs Theatre",
        venue: "Bernard B. Jacobs Theatre",
        description:
          "A new musical adaptation of S.E. Hinton's classic novel about teenage gangs in 1960s Oklahoma.",
        isOpenRun: true,
        isInPreviews: true,
        openingDate: createDate(2024, 4, 11),
        previewDate: createDate(2024, 3, 16),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: null,
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Water for Elephants",
        district: "broadway" as const,
        theatre: "Imperial Theatre",
        venue: "Imperial Theatre",
        description:
          "A new musical based on Sara Gruen's bestselling novel about a veterinary student who joins a traveling circus during the Great Depression.",
        isOpenRun: true,
        isInPreviews: false,
        openingDate: createDate(2024, 3, 21),
        previewDate: createDate(2024, 2, 24),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: null,
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Oh, Mary!",
        district: "off-broadway" as const,
        theatre: "Lyceum Theatre",
        venue: "Lyceum Theatre",
        description:
          "A dark comedy about Mary Todd Lincoln and her struggles with mental health.",
        isOpenRun: false,
        isInPreviews: false,
        openingDate: createDate(2024, 6, 26),
        previewDate: createDate(2024, 6, 4),
        closingDate: createDate(2024, 9, 15),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: null,
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Suffs",
        district: "broadway" as const,
        theatre: "Music Box Theatre",
        venue: "Music Box Theatre",
        description:
          "A musical about the women's suffrage movement and the fight for the right to vote.",
        isOpenRun: true,
        isInPreviews: false,
        openingDate: createDate(2024, 4, 18),
        previewDate: createDate(2024, 3, 26),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: null,
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Merrily We Roll Along",
        district: "broadway" as const,
        theatre: "Hudson Theatre",
        venue: "Hudson Theatre",
        description:
          "Stephen Sondheim's musical about friendship, ambition, and the price of success, told in reverse chronological order.",
        isOpenRun: false,
        isInPreviews: false,
        openingDate: createDate(2023, 10, 10),
        previewDate: createDate(2023, 9, 19),
        closingDate: createDate(2024, 7, 7),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: null,
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
      {
        title: "Cabaret",
        district: "broadway" as const,
        theatre: "August Wilson Theatre",
        venue: "August Wilson Theatre",
        description:
          "The classic Kander and Ebb musical set in 1930s Berlin at the Kit Kat Club.",
        isOpenRun: true,
        isInPreviews: false,
        openingDate: createDate(2024, 4, 21),
        previewDate: createDate(2024, 4, 1),
        showtimes: {
          monday: null,
          tuesday: "19:00",
          wednesday: "19:00",
          thursday: "19:00",
          friday: "14:00,20:00",
          saturday: "14:00,20:00",
          sunday: "15:00",
        },
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
      },
    ];

    // Insert all shows
    const showIds = [];
    for (const show of mockShows) {
      const showId = await ctx.db.insert("shows", {
        ...show,
        createdAt: now,
        updatedAt: now,
      });
      showIds.push(showId);
    }

    return {
      userId,
      showIds,
      message: `Created ${mockShows.length} shows and 1 user`,
    };
  },
});

