
In vision.md, I mentioned that the Calendar view was a large part of the app, but I'd actually like to change that up a bit. While having a general calendar view where you can see all of the shows that are active at any time is still cool, I think the more valuable thing to the user is more of a "trip planner". It's "I'm visiting in a few weeks and I want to plan out what I'm going to see". Therefore, the user needs to be able to have a list of Trips that are saved in storage, kind of like the list of Chats in Claude, or the list of Notes in Apple's Notes app. 

So the main application page will have some kind of Search function where the user can browse shows, either by searching or browsing different categories/filters, which would show info like location, start date, end date, main actors, show vibes, genre, Previews or not, open run or not, etc., and also the ability for the user to add each show to their Interested List or directly into a Trip. Maybe this "Browse" view would have a few tabs at the top to choose from, i.e. Search would be for looking up shows, Browse maybe is for seeing different curated lists or using filters to find shows (Or the search could just be at the top of the whole section, or just the Browse section), and then it could have like a "My Lists" view, where the user gets to see all of the shows that they have marked with different tags, e.g. "Seen", "Want to See", "Interested In", "Look Into", "Not Interested", etc.  

The "Trip" view on this page would almost be like a mini calendar, with a main section for each day of the trip. For example, say we are planning a trip for Friday December 19th to Sunday December 21st, then the trip view would show 3 sections, one for each day. Each day within a trip would have different slots, which represent different shows, e.g. a matinee slot and an evening show slot. Slots can also be used for all kinds of other things, whether it's flights, ubers, checking in to a hotel, dropping off bags, meals, of course trips to the TKTS booth or to go stand in line for Rush tickets or other ticket-related events, etc. We could also allow custom slots for edge cases, e.g. if someone was actually able to see more than 2 shows in a day (e.g. 1pm, 5pm, 9pm), they could add an extra slot for an extra show. I think this is the way to go so that we can use the most-common case of "matinee + evening show" as the generic day, instead of us trying to dynamically account for special cases like this. Maybe we can build some kind of tool to check for these dynamic cases in the background. 

Re: a tool for checking for niche / edge cases dynamically: Maybe we can eventually have an AI tool that takes in all of the multimodal data of the user's Lists, the current Trip, and the full list of showtimes, etc. and creates different permutations of schedule recommendations for the user. For example, if the user has 3 shows on their "interested list" and they all have different showtimes, maybe the AI is able to see all of that data and figure out that the user could actually hit all 3 in one day and still have time for meals and stuff, idk I'm just spitballing.

On the subject of AI tools, it might also be cool to incorporate the tool that I talked about in vision.md that basically takes in UserProfile data, user lists, etc. and evaluates each show to provide a summary of if the user would be likely to enjoy that show, why or why not, etc. 
 
Back to the trip planning: for each slot within a day, in the case of Shows, we could have a "Primary Show" for each slot, e.g. if I really want to see Lion King and that's at 1pm, that would be the main slot. However, part of trip planning is planning for things going wrong, e.g. they run out of Lion King tickets, or they're too expensive, or one of the lead people is out. I was initially thinking we could just tag those backup plans onto the Primary show, but then I remembered that backup shows might be at different times. I still think that maybe just having backup plans be tagged onto the primary show, even if they are different times, and we would just highlight the different show times so the user is aware that things might change. 

Everything I just mentioned, I am imagining as one "screen" that the user works from. Other screens would be: 
    Profile, for viewing/updating profile info, lists, rankings, settings, etc.
    In the Loop, which is more of a calendar view showing all past/current/future shows and the ability to add them to your lists, to trips, and notifications; there could also be a section for more general notifications, such as "Notify me about newly-announced shows", or "Only notify me about shows we think you would enjoy", or "Notifications for general theatre news and events"

Suggested architecture, by no means is this set in stone at all:

/app
    /components
        - reusable buttons, lists, etc. that are used throughout the app and represent general ui components
    /trip-planner
        /browse
            BrowsePanel
            SearchPanel
            MyListsPanel
        /trip
            TripView
            TripDay
            TripEvent
        /plan
            PotentialShows
            TripPlannerChatbot
    /profile
        UserInfo
        Rankings
        Lists
        TasteProfile
        Notifications
        Settings
    /in-the-loop
        ShowsCalendar
        NotificationPlanner
/convex/functions
    users
    trips
    lists
    shows
    etc.


Just spitballing on what data structure might look like, definitely not set in stone at all:

Trip {
    id: 
    title: string
    description: string
    days: TripDay[]
    startDate: date
    startTime: (e.g. morning flight)
    endDate: date
    endTime: (e.g. afternoon flight)
}

TripDay {
    id: 
    tripId
    date: 
    slots: TripDaySlot[]
}

TripDaySlot {
    id: 
    tripId:
    tripDayId:
    type: show | meal | transport | flight | etc.
    title:
    startTime:
    endTime:
}

Show {
    id: 
    title: string
    description: string
    showtimes: Showtimes
    previewDate: date | null
    openingDate: date | null
    closingDate: date | null
    isOpenRun: boolean
    isInPreviews: boolean
    theatre: string
    district: string
}

Showtimes {
    monday: time | null
    tuesday: time | null
    wednesday: time | null
    thursday: time | null
    friday: time | null
    saturday: time | null
    sunday: time | null
}

UserProfile {
    id:
    username:
    email:
    password:
    name: 
    rankings: RankedList[]
    lists: UserList[]

}

UserList {
    id: 
    title:
    description:
    shows: []
}

RankedList {
    id:
    title:
    description: 
    numbered list of Show[]?
}

TasteProfile {
    id: 
    likes: TheatreCharacteristics[]
    dislikes: TheatreCharacteristics[]
    profileQuestions: How often do you visit NYC? How often do you go to the theatre?
}

TheatreCharacteristics {
    themes: dark comedy, wholesome comedy, farce, campy, serious, dark, thriller, psychological, horror, deep, rom com, love story
    type: plays, musicals, jukebox musicals, sung-through musicals
    morals: self-esteem, virtue, hero, hero's journey, tragedy, uplifting, harrowing
}

Some other thoughts:
    Trip Planner - mostly just React components pulling from lists, rankings, etc.
    Profile - very simple to create a simple ranking list; to get the theatre cloud working, we would either need to manually insert pictures, or write some kind of tool to grab them from the internet, etc. 
    Lists / Interests - while we could use mock data for shows and just have a general database and be able to add these shows to different lists, I think this would require a tool to set up correctly, i.e. a data-fetching tool that gets show and news data from the internet