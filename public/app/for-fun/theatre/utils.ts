// Show data utility functions
import { theatreShowList, TheatreShow } from './data/shows-ben'

export const getBaseShowName = (showName: string): string => {
  // Remove viewing number from show name (e.g., "Hadestown (2)" -> "Hadestown")
  // But keep original names like "Hadestown" unchanged
  return showName.replace(/\s*\(\d+\)$/, '');
};

export const getShowRank = (showName: string): number => {
  const baseShowName = getBaseShowName(showName);
  const show = theatreShowList.find(s => getBaseShowName(s.name) === baseShowName);
  return show ? show.rank : 0;
};

export const getShowBySlug = (slug: string): TheatreShow | undefined => {
  return theatreShowList.find(s => s.slug === slug);
};

export const getTotalShows = (): number => {
  return theatreShowList.length;
};

export const getShowVisits = (showName: string) => {
  const baseShowName = getBaseShowName(showName);
  const show = theatreShowList.find(s => getBaseShowName(s.name) === baseShowName);
  return show ? show.visits : [];
};

export const getShowDates = (showName: string): string[] => {
  const visits = getShowVisits(showName);
  return visits.map(v => v.date).filter(Boolean);
};

export const formatShowings = (visits: any[]): string => {
  if (visits.length === 1) {
    const visit = visits[0];
    const dateStr = visit.date ? ` - ${visit.date}` : '';
    return `${visit.theatre}${visit.district ? ` (${visit.district})` : ''}${dateStr}`;
  }
  return visits.map(visit => {
    const dateStr = visit.date ? ` - ${visit.date}` : '';
    return `${visit.theatre}${visit.district ? ` (${visit.district})` : ''}${dateStr}`;
  }).join(', ');
};

export const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
};

export const formatRank = (rank: number, total: number): string => {
  return `${rank}${getOrdinalSuffix(rank)} of ${total}`;
};

export const getShowDistrict = (showName: string): string => {
  const show = theatreShowList.find(s => s.name === showName);
  return show?.visits[0]?.district || 'Broadway';
}; 