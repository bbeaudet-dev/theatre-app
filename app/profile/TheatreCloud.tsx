"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser, getAuthToken } from "@/lib/auth-client";
import { 
  type PositionedShow, 
  createTheatreCloudLayout, 
  getObjectPosition 
} from './TheatreCloudAnimation';

// Format date like "June 15th, 2024"
function formatDateLong(timestamp: number): string {
  const date = new Date(timestamp);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  // Add ordinal suffix (st, nd, rd, th)
  const getOrdinal = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  return `${month} ${getOrdinal(day)}, ${year}`;
}

// Generate slug from title
function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function TheatreCloud() {
  const userId = useCurrentUser();
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  const rankings = useQuery(
    api.functions.profile.getUserRankings,
    userId && token ? { userId, token } : "skip"
  );

  const [selectedRanking, setSelectedRanking] = useState<any | null>(null);
  const [positionedShows, setPositionedShows] = useState<PositionedShow[]>([]);
  const [filter, setFilter] = useState<'all' | 'Broadway' | 'Playhouse Square' | 'West End' | 'Off-Broadway' | 'Local' | 'Touring'>('all');
  const [imageOpacity, setImageOpacity] = useState<Record<string, number>>({});
  const [showScale, setShowScale] = useState<Record<string, number>>({});
  const [currentPattern, setCurrentPattern] = useState(0);

  // Fetch visits for selected show
  const visits = useQuery(
    api.functions.profile.getUserShowVisits,
    selectedRanking?._id ? { userShowId: selectedRanking._id } : "skip"
  );

  if (userId === undefined || rankings === undefined) {
    return (
      <div className="space-y-6">
        <div className="border rounded p-8 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Theatre Cloud</h2>
          <div className="border rounded p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-500">
              Please sign in to view your theatre cloud.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Theatre Cloud</h2>
          <div className="border rounded p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-500">
              You haven't ranked any shows yet. Mark shows as "Seen" and rank
              them to see your theatre cloud!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter shows based on selected district
  const filteredRankings = useMemo(() => {
    if (!rankings) return [];
    return rankings.filter(ranking => {
      if (!ranking.show) return false;
      if (filter === 'all') return true;
      // Check if show has this district, or if visits have this district
      if (ranking.show.district) {
        const showDistrict = ranking.show.district.charAt(0).toUpperCase() + ranking.show.district.slice(1).replace(/-/g, ' ');
        if (showDistrict === filter || ranking.show.district.toLowerCase() === filter.toLowerCase()) {
          return true;
        }
      }
      // For now, return true if filter matches show district
      // We could enhance this to check visits once we fetch them
      return false;
    });
  }, [rankings, filter]);

  // Helper function to count shows by district
  const getShowCountByDistrict = (district: string) => {
    if (!rankings) return 0;
    return rankings.filter(ranking => {
      if (!ranking.show) return false;
      if (ranking.show.district) {
        const showDistrict = ranking.show.district.charAt(0).toUpperCase() + ranking.show.district.slice(1).replace(/-/g, ' ');
        return showDistrict === district || ranking.show.district.toLowerCase() === district.toLowerCase();
      }
      return false;
    }).length;
  };

  // Initialize image opacity and scale for shows
  useEffect(() => {
    if (!rankings) return;
    const initialOpacity: Record<string, number> = {};
    const initialScale: Record<string, number> = {};
    rankings.forEach(ranking => {
      if (ranking.show) {
        const slug = titleToSlug(ranking.show.title);
        initialOpacity[slug] = 1;
        initialScale[slug] = 1;
      }
    });
    setImageOpacity(initialOpacity);
    setShowScale(initialScale);
  }, [rankings]);

  // Update layout when filtered rankings change
  useEffect(() => {
    if (filteredRankings.length > 0) {
      const layout = createTheatreCloudLayout(filteredRankings);
      setPositionedShows(layout);
    }
  }, [filteredRankings]);

  const handleShowClick = (ranking: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedRanking(selectedRanking?._id === ranking._id ? null : ranking);
  };

  const handleContainerClick = () => {
    if (selectedRanking) {
      setSelectedRanking(null);
    }
  };

  // Global click handler to deselect when clicking outside the component
  useEffect(() => {
    if (!selectedRanking) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cloudContainer = target.closest('[data-theatre-cloud]');
      if (!cloudContainer) {
        setSelectedRanking(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedRanking(null);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleGlobalClick);
      document.addEventListener('keydown', handleKeyDown);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedRanking]);

  // Wave animation for all shows (alternating patterns)
  useEffect(() => {
    if (filteredRankings.length === 0) return;

    const interval = setInterval(() => {
      let showsInOrder = [...filteredRankings];
      
      switch (currentPattern) {
        case 0: // Top-left to bottom-right diagonal
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show._id === a._id);
            const showB = positionedShows.find(ps => ps.show._id === b._id);
            if (!showA || !showB) return 0;
            const diagonalA = showA.x + showA.y;
            const diagonalB = showB.x + showB.y;
            return diagonalA - diagonalB;
          });
          break;
          
        case 1: // Top-right to bottom-left diagonal
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show._id === a._id);
            const showB = positionedShows.find(ps => ps.show._id === b._id);
            if (!showA || !showB) return 0;
            const diagonalA = showA.x - showA.y;
            const diagonalB = showB.x - showB.y;
            return diagonalB - diagonalA;
          });
          break;
          
        case 2: // Bottom-right to top-left diagonal
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show._id === a._id);
            const showB = positionedShows.find(ps => ps.show._id === b._id);
            if (!showA || !showB) return 0;
            const diagonalA = showA.x + showA.y;
            const diagonalB = showB.x + showB.y;
            return diagonalB - diagonalA;
          });
          break;
          
        case 3: // Bottom-left to top-right diagonal
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show._id === a._id);
            const showB = positionedShows.find(ps => ps.show._id === b._id);
            if (!showA || !showB) return 0;
            const diagonalA = showA.x - showA.y;
            const diagonalB = showB.x - showB.y;
            return diagonalA - diagonalB;
          });
          break;
          
        case 4: // Outwards from center to edges
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show._id === a._id);
            const showB = positionedShows.find(ps => ps.show._id === b._id);
            if (!showA || !showB) return 0;
            const centerX = 400;
            const centerY = 400;
            const distanceA = Math.sqrt((showA.x - centerX) ** 2 + (showA.y - centerY) ** 2);
            const distanceB = Math.sqrt((showB.x - centerX) ** 2 + (showB.y - centerY) ** 2);
            return distanceA - distanceB;
          });
          break;
          
        case 5: // Inwards from edges to center
          showsInOrder.sort((a, b) => {
            const showA = positionedShows.find(ps => ps.show._id === a._id);
            const showB = positionedShows.find(ps => ps.show._id === b._id);
            if (!showA || !showB) return 0;
            const centerX = 400;
            const centerY = 400;
            const distanceA = Math.sqrt((showA.x - centerX) ** 2 + (showA.y - centerY) ** 2);
            const distanceB = Math.sqrt((showB.x - centerX) ** 2 + (showB.y - centerY) ** 2);
            return distanceB - distanceA;
          });
          break;
      }
      
      // Stagger the wave animation
      showsInOrder.forEach((ranking, index) => {
        const delay = index * 35;
        const slug = ranking.show ? titleToSlug(ranking.show.title) : '';
        if (!slug) return;
        
        setTimeout(() => {
          // Scale up
          setShowScale(prev => ({
            ...prev,
            [slug]: 1.125
          }));
          
          // Scale back down after 600ms
          setTimeout(() => {
            setShowScale(prev => ({
              ...prev,
              [slug]: 1
            }));
          }, 600);
        }, delay);
      });
      
      // Move to next pattern
      setCurrentPattern((prev) => (prev + 1) % 6);
      
    }, 3500);
    
    return () => {
      clearInterval(interval);
    };
  }, [filteredRankings, positionedShows, currentPattern]);

  // Find the positioned show for the selected ranking
  const selectedPositionedShow = selectedRanking 
    ? positionedShows.find(ps => ps.show._id === selectedRanking._id)
    : null;

  // Calculate bubble position if a show is selected
  const bubblePosition = useMemo(() => {
    if (!selectedPositionedShow) return null;
    
    const bubbleWidth = Math.max(300, Math.min(380, selectedPositionedShow.width * 2.5));
    const showCenterX = selectedPositionedShow.x + selectedPositionedShow.width / 2;
    const bubbleLeft = showCenterX - bubbleWidth / 2;
    const bubbleTop = selectedPositionedShow.y + selectedPositionedShow.height + 10;
    
    let adjustedLeft = bubbleLeft;
    let adjustedTop = bubbleTop;
    
    if (bubbleLeft + bubbleWidth > 800) {
      adjustedLeft = 800 - bubbleWidth - 10;
    }
    
    if (adjustedLeft < 10) {
      adjustedLeft = 10;
    }
    
    const estimatedBubbleHeight = 200;
    if (bubbleTop + estimatedBubbleHeight > 800) {
      adjustedTop = selectedPositionedShow.y - estimatedBubbleHeight - 10;
    }
    
    return {
      left: adjustedLeft,
      top: adjustedTop,
      width: bubbleWidth
    };
  }, [selectedPositionedShow]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Theatre Cloud</h2>
        <div data-theatre-cloud className="flex justify-center">
          <div 
            className="relative border rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-900" 
            style={{ width: '800px', height: '800px' }}
            onClick={handleContainerClick}
          >
            {positionedShows.map((positionedShow) => {
              const ranking = positionedShow.show;
              if (!ranking.show) return null;
              
              const isSelected = selectedRanking?._id === ranking._id;
              const slug = titleToSlug(ranking.show.title);
              const baseScale = showScale[slug] ?? 1;
              const finalScale = isSelected ? baseScale * 1.15 : baseScale;
              
              return (
                <div
                  key={ranking._id}
                  className="absolute cursor-pointer transition-all duration-500 hover:scale-105"
                  style={{
                    left: positionedShow.x,
                    top: positionedShow.y,
                    width: positionedShow.width,
                    height: positionedShow.height,
                    transform: `scale(${finalScale})`,
                    transition: 'transform 0.5s ease-in-out, filter 0.25s ease-in-out',
                    zIndex: isSelected ? 1000 : Math.round(positionedShow.width),
                    filter: selectedRanking && !isSelected ? 'blur(2px) brightness(0.7)' : 'none'
                  }}
                  onClick={(e) => handleShowClick(ranking, e)}
                >
                  {ranking.show.imageUrl ? (
                    <div 
                      className="w-full h-full overflow-hidden"
                      style={{ borderRadius: `${Math.max(2, Math.min(8, positionedShow.width * 0.1))}px` }}
                    >
                      <div
                        className={`relative overflow-hidden border transition-all duration-300 ${
                          isSelected 
                            ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400 ring-opacity-50' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        style={{
                          width: positionedShow.width,
                          height: positionedShow.height,
                          borderRadius: `${Math.max(2, Math.min(8, positionedShow.width * 0.1))}px`,
                          boxShadow: isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none'
                        }}
                      >
                        <Image
                          src={ranking.show.imageUrl}
                          alt={ranking.show.title}
                          width={positionedShow.width}
                          height={positionedShow.height}
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{
                            objectPosition: getObjectPosition(ranking.show.title),
                            opacity: imageOpacity[slug] ?? 1,
                            transition: 'opacity 0.3s ease-in-out'
                          }}
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-center overflow-hidden border border-gray-300 dark:border-gray-600"
                      style={{ 
                        borderRadius: `${Math.max(2, Math.min(8, positionedShow.width * 0.1))}px`,
                        padding: `${Math.max(1, positionedShow.width * 0.05)}px`
                      }}
                    >
                      <span 
                        className="font-medium text-gray-700 dark:text-gray-300 leading-tight break-words"
                        style={{ 
                          fontSize: `${Math.max(8, Math.min(12, positionedShow.width * 0.15))}px`,
                          lineHeight: '1.1'
                        }}
                      >
                        {ranking.show.title}
                      </span>
                    </div>
                  )}
                  
                  {/* Rank badge */}
                  <div className="absolute top-1 left-1 bg-black bg-opacity-75 text-white text-[10px] px-1.5 py-0.5 rounded">
                    #{ranking.rank}
                  </div>
                </div>
              );
            })}
            
            {/* Selected Show Details - Bubble positioned under the selected show */}
            {selectedRanking && selectedRanking.show && selectedPositionedShow && bubblePosition && (
              <div
                className="absolute bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300"
                style={{
                  left: `${bubblePosition.left}px`,
                  top: `${bubblePosition.top}px`,
                  width: `${bubblePosition.width}px`,
                  zIndex: 1001,
                  maxWidth: '380px'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">{selectedRanking.show.title}</h3>
                
                {/* Show Info */}
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <p><strong>Rank:</strong> #{selectedRanking.rank} of {rankings?.length || 0}</p>
                  
                  {visits && visits.length > 0 && (
                    <>
                      <p><strong>Visits:</strong></p>
                      {visits.map((visit: any) => (
                        <div key={visit._id} className="ml-1">
                          <p>{visit.theatre} ({visit.district}) - {formatDateLong(visit.visitDate)}</p>
                        </div>
                      ))}
                    </>
                  )}
                  
                  {selectedRanking.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="italic text-[11px]">{selectedRanking.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex justify-center flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All ({rankings?.length || 0})
        </button>
        <button
          onClick={() => setFilter('Broadway')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            filter === 'Broadway'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Broadway ({getShowCountByDistrict('Broadway')})
        </button>
        <button
          onClick={() => setFilter('Off-Broadway')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            filter === 'Off-Broadway'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Off-Broadway ({getShowCountByDistrict('Off-Broadway')})
        </button>
        <button
          onClick={() => setFilter('Playhouse Square')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            filter === 'Playhouse Square'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Playhouse Square ({getShowCountByDistrict('Playhouse Square')})
        </button>
        <button
          onClick={() => setFilter('West End')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            filter === 'West End'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          West End ({getShowCountByDistrict('West End')})
        </button>
        <button
          onClick={() => setFilter('Touring')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            filter === 'Touring'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Touring ({getShowCountByDistrict('Touring')})
        </button>
      </div>
    </div>
  );
}
