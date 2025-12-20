# Broadway Data API Research

## APIs Evaluated

### 1. IBDB (Internet Broadway Database)

**URL**: https://www.ibdb.com/shows/

**Status**: ❌ Not Feasible

- IBDB is a website, not an API
- No public API endpoints available
- Would require web scraping, which is unreliable and may violate terms of service
- Data is primarily historical (past shows) rather than current/upcoming

**Verdict**: Not recommended for this project.

---

### 2. Broadway Musicals API (audreysharp)

**URL**:

- Documentation: https://audreysharp.gitbooks.io/broadway-musicals-api/content/
- GitHub: https://github.com/audreysharp/broadway-api

**Status**: ⚠️ Limited Feasibility

- RESTful API with endpoints for musicals, actors, and songs
- Appears to be a personal/side project
- Requires local setup (PHP/Laravel, MAMP)
- Database structure suggests it's designed for personal use, not production
- No clear indication of:
  - Current show data (opening/closing dates, showtimes)
  - API availability/hosting
  - Rate limits or usage terms
  - Data freshness/update frequency

**Verdict**: Could be useful for reference, but not suitable as a primary data source without:

- Confirming the API is publicly hosted
- Understanding data update frequency
- Verifying it includes current/upcoming show information

---

### 3. Medium Article: "Opening the Stage Door for Big Data in Broadway"

**URL**: https://yaakovbressler.medium.com/opening-the-stage-door-for-big-data-in-broadway-20ca3e35a274

**Status**: 📖 Research/Reference Only

- Article discusses Broadway data analysis
- Not an API, but may contain insights about data sources
- Could provide ideas for data collection strategies

**Verdict**: Worth reading for insights, but not a direct data source.

---

## Recommendations

### Current Approach (Best for Now)

1. **Manual Data Entry**: Continue with seed data and manual entry
2. **User-Generated Content**: Allow users to add shows themselves
3. **Future Integration**: When ready, consider:
   - Playbill.com (may have structured data)
   - Broadway.com (may have APIs or structured data)
   - Theatre-specific APIs (individual theatres may have APIs)
   - Web scraping (with proper legal considerations)

### Alternative Data Sources to Research

1. **Playbill.com**: May have structured data or APIs
2. **Broadway.com**: Check for developer resources
3. **Theatre-specific APIs**: Some major theatres (e.g., Lincoln Center) may have APIs
4. **Ticketmaster/StubHub APIs**: For showtimes and availability
5. **Google Events API**: May have Broadway show data

### Implementation Strategy

- **Phase 1 (Current)**: Use seed data and manual entry
- **Phase 2**: Build data entry UI for users to add shows
- **Phase 3**: Research and integrate real-time data sources
- **Phase 4**: Consider building a data aggregation service

---

## Conclusion

None of the APIs found are immediately suitable for production use. The best approach is to:

1. Continue with the current seed data system
2. Build robust data entry/management features
3. Research more established data sources (Playbill, Broadway.com)
4. Consider building a community-driven database
