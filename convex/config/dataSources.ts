/**
 * Data source configuration for show data synchronization
 * 
 * Each source defines where to fetch show data from, whether it's enabled,
 * and what type of shows it provides (current, upcoming, historical).
 */

export type DataSourceType = "current" | "upcoming" | "historical";

export interface DataSource {
  name: string;
  url: string;
  enabled: boolean;
  type: DataSourceType;
}

/**
 * Configured data sources for show data extraction
 * 
 * Sources are checked in order. Enable/disable sources by setting `enabled: true/false`.
 * Only enabled sources will be fetched during sync operations.
 */
export const DATA_SOURCES: DataSource[] = [
  // Playbill.com - Well-structured, reliable source
  {
    name: "playbill-broadway",
    url: "https://playbill.com/shows/broadway",
    enabled: false,
    type: "current",
  },
  {
    name: "playbill-offbroadway",
    url: "https://playbill.com/shows/offbroadway",
    enabled: false,
    type: "current",
  },
  {
    name: "playbill-upcoming-broadway",
    url: "https://playbill.com/article/schedule-of-upcoming-and-announced-broadway-shows",
    enabled: false,
    type: "upcoming",
  },
  // Broadway.com - Secondary source for validation
  {
    name: "broadway-com-all",
    url: "https://www.broadway.com/shows/tickets/?view_all=true",
    enabled: false,
    type: "current",
  },
  {
    name: "broadway-com-broadway",
    url: "https://www.broadway.com/shows/tickets/?category=broadway&view_all=true",
    enabled: false,
    type: "current",
  },
  {
    name: "broadway-com-offbroadway",
    url: "https://www.broadway.com/shows/tickets/?category=off-broadway&view_all=true",
    enabled: false,
    type: "current",
  },
  // Historical sources (for rankings feature - disabled by default, can enable later)
  {
    name: "playbill-vault",
    url: "https://playbill.com/vault",
    enabled: false,
    type: "historical",
  },
  {
    name: "broadway-com-classics",
    url: "https://www.broadway.com/shows/tickets/?category=classics&view_all=true",
    enabled: false,
    type: "historical",
  },
  // Wikipedia - Comprehensive list of Broadway musicals (category pages)
  {
    name: "wikipedia-category-page1",
    url: "https://en.wikipedia.org/wiki/Category:Broadway_musicals",
    enabled: false,
    type: "historical",
  },
  {
    name: "wikipedia-category-page2",
    url: "https://en.wikipedia.org/w/index.php?title=Category:Broadway_musicals&pagefrom=Century+Revue%2C+The%0AThe+Century+Revue#mw-pages",
    enabled: false,
    type: "historical",
  },
  {
    name: "wikipedia-category-page3",
    url: "https://en.wikipedia.org/w/index.php?title=Category:Broadway_musicals&pagefrom=Grey+Gardens+%28musical%29#mw-pages",
    enabled: false,
    type: "historical",
  },
  {
    name: "wikipedia-category-page4",
    url: "https://en.wikipedia.org/w/index.php?title=Category:Broadway_musicals&pagefrom=Love+Song+operetta%2C+The%0AThe+Love+Song+%28operetta%29#mw-pages",
    enabled: false,
    type: "historical",
  },
  {
    name: "wikipedia-category-page5",
    url: "https://en.wikipedia.org/w/index.php?title=Category:Broadway_musicals&pagefrom=Raggedy+Ann+%28musical%29#mw-pages",
    enabled: false,
    type: "historical",
  },
  {
    name: "wikipedia-category-page6",
    url: "https://en.wikipedia.org/w/index.php?title=Category:Broadway_musicals&pagefrom=Top+Speed+%28musical%29#mw-pages",
    enabled: false,
    type: "historical",
  },
  // BroadwayWorld.com - Comprehensive database with years 1732-2025
  // Available years: 1843 to 2025, as well as 1832 to 1841, 1830, 1825-1826, 1820-1823, 1816, 1804, 1799, 1796, 1795, 1794, 1793, 1789, 1787, 1786, 1785, 1778, 1773, 1769, 1768, 1767, 1761, 1754, 1753, 1751, 1750, and 1732
  // 
  // COMPLETED YEARS (already synced):
  // ✅ 2025, 2024, 2023, 2022, 2021, 2020
  //
  // To sync more years, enable additional sources below or add new ones following the pattern:
  // URL format: https://www.broadwayworld.com/browseshows.php?showtype=BR&open_yr=YYYY

    {
        name: "broadwayworld-2019",
        url: "https://www.broadwayworld.com/browseshows.php?showtype=BR&open_yr=2023",
        enabled: true, 
        type: "historical",
    },
    {
        name: "broadwayworld-2018",
        url: "https://www.broadwayworld.com/browseshows.php?showtype=BR&open_yr=2023",
        enabled: true, 
        type: "historical",
    },
    {
        name: "broadwayworld-2017",
        url: "https://www.broadwayworld.com/browseshows.php?showtype=BR&open_yr=2023",
        enabled: true, 
        type: "historical",
    },
    {
        name: "broadwayworld-2016",
        url: "https://www.broadwayworld.com/browseshows.php?showtype=BR&open_yr=2023",
        enabled: true, 
        type: "historical",
    },
    {
        name: "broadwayworld-2015",
        url: "https://www.broadwayworld.com/browseshows.php?showtype=BR&open_yr=2023",
        enabled: true, 
        type: "historical",
    },
    {
        name: "broadwayworld-2014",
        url: "https://www.broadwayworld.com/browseshows.php?showtype=BR&open_yr=2023",
        enabled: true, 
        type: "historical",
    }
];

/**
 * Sync configuration settings
 */
export const SYNC_CONFIG = {
  // Retry configuration for failed fetches
  fetchRetries: 3,
  fetchRetryDelay: 2000, // Initial delay in ms (exponential backoff)
  
  // Timeout for HTTP requests (ms)
  fetchTimeout: 30000, // 30 seconds
  
  // Minimum confidence score for extracted data (0-1)
  minConfidenceScore: 0.9,
  
  // Whether to validate extracted data with AI cross-referencing
  enableValidation: true,
} as const;
