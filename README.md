# Theatre App

A comprehensive web application for theatre enthusiasts to stay informed about Broadway, Off-Broadway, touring, and local productions. Get personalized show recommendations, plan your theatre trips, and track your show rankings.

## Features

### 📅 Calendar

View all shows currently running on Broadway, Off-Broadway, touring, and local productions. Filter by location and export to Google Calendar.

### 🔔 Notify

Stay up to date on shows you're interested in. Get notified about openings, closings, cast changes, news, and reviews via email or SMS. AI-powered news scanning keeps you informed automatically.

### 🤖 Preview

AI-powered chatbot that helps you decide if you'll enjoy a show. Ask about single shows or compare multiple shows. The AI uses your show rankings, preferences, and theatre tastes to provide personalized recommendations without spoilers.

### 📋 Plan

Plan your theatre trip! See show schedules, ticket options (rush, lottery, student discounts), and availability at a glance. Get alerts when shows on your interested list are closing soon.

### 👤 Profile & Rankings

Record and rank all the shows you've seen. Create your theatre cloud visualization and manage your preferences. Your rankings and preferences power the AI recommendations.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) with React and TypeScript
- **Backend**: Convex (database + backend functions)
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI/Anthropic API (for recommendations and news scanning)
- **Calendar Integration**: Google Calendar API

## Project Structure

```
theatre-news/
├── app/                      # Next.js App Router
│   ├── calendar/            # Calendar feature
│   ├── notify/              # Notify feature
│   ├── preview/             # Preview chatbot feature
│   ├── plan/                # Plan feature
│   └── profile/             # Profile/Rankings feature
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── calendar/            # Calendar-specific components
│   ├── notify/              # Notify components
│   ├── preview/             # Preview chatbot components
│   ├── plan/                # Plan components
│   └── profile/             # Profile/Rankings components
├── convex/                  # Convex backend
│   ├── schema.ts            # Database schema
│   └── functions/           # Backend functions
│       ├── calendar.ts
│       ├── notify.ts
│       ├── preview.ts
│       ├── plan.ts
│       └── profile.ts
└── lib/                     # Frontend utilities
    ├── convex/              # Convex client setup
    └── ai/                  # AI integration utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Convex account (free tier available)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd theatre-news
```

2. Install dependencies:

```bash
npm install
```

3. Set up Convex:

```bash
npx convex dev
```

This will:

- Create a Convex project (if you don't have one)
- Generate the necessary configuration files
- Provide you with a `NEXT_PUBLIC_CONVEX_URL` to add to your `.env.local`

4. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

5. Add your environment variables to `.env.local`:
   - `NEXT_PUBLIC_CONVEX_URL`: Provided by Convex after running `npx convex dev`
   - `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`: For AI features (optional for initial setup)
   - Google Calendar API credentials (optional, for calendar export)
   - Email/SMS service credentials (optional, for notifications)

6. Run the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Convex Functions

Convex functions are located in `convex/functions/`. Each feature has its own file:

- `calendar.ts`: Show calendar data and Google Calendar export
- `notify.ts`: Notification preferences and news scanning
- `preview.ts`: AI recommendation logic
- `plan.ts`: Trip planning and schedules
- `profile.ts`: User profiles, rankings, and preferences

### Database Schema

The database schema is defined in `convex/schema.ts`. Key tables:

- `users`: User profiles
- `shows`: Show metadata
- `userShows`: User-show relationships (seen, interested, rankings)
- `notifications`: Notification history
- `notificationPreferences`: User notification settings
- `userPreferences`: General theatre preferences
- `showSchedules`: Show schedules for planning

### Adding New Features

1. Add database schema updates to `convex/schema.ts` if needed
2. Create Convex functions in `convex/functions/`
3. Create React components in `components/`
4. Add routes in `app/` if needed
5. Update navigation in `components/ui/Navigation.tsx`

## Environment Variables

See `.env.example` for all available environment variables. Key variables:

- `NEXT_PUBLIC_CONVEX_URL`: Required - Convex deployment URL
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`: Optional - For AI features
- `GOOGLE_CALENDAR_CLIENT_ID` / `GOOGLE_CALENDAR_CLIENT_SECRET`: Optional - For calendar export
- `TWILIO_*`: Optional - For SMS notifications
- `EMAIL_SERVICE_API_KEY`: Optional - For email notifications

## Next Steps

This is a skeleton implementation. To make it fully functional:

1. **Implement Convex functions**: Fill in the TODO sections in each function file
2. **Connect components to Convex**: Use `useQuery` and `useMutation` from Convex React
3. **Set up AI integration**: Implement the recommendation and news scanning logic
4. **Add authentication**: Set up user authentication (Convex Auth recommended)
5. **Implement data sources**: Connect to APIs or data sources for show information
6. **Add Google Calendar integration**: Implement calendar export functionality
7. **Set up notification services**: Integrate email/SMS services

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
