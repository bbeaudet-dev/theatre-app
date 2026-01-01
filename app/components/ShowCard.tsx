"use client";

import { useState, useRef } from "react";
import QuickActions from "../browse/QuickActions";
import { ShowCardProps, ViewMode } from "@/lib/types";
import DetailedShowCard from "@/app/components/DetailedShowCard";

export default function ShowCard({ show, viewMode }: ShowCardProps & { viewMode: ViewMode }) {
  const [showActions, setShowActions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Detect if mobile (touch device)
  const isMobile = typeof window !== "undefined" && "ontouchstart" in window;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const dateRange = () => {
    if (show.isOpenRun) {
      return `Opened ${formatDate(show.openingDate || show.previewDate)}`;
    }
    if (show.closingDate) {
      return `${formatDate(show.previewDate || show.openingDate)} - ${formatDate(show.closingDate)}`;
    }
    return formatDate(show.previewDate || show.openingDate);
  };

  const handleClick = () => {
    if (isMobile) {
      setShowDetails(!showDetails);
    } else {
      setShowDetails(!showDetails);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !showDetails) {
      setIsHovering(false);
    }
  };

  if (viewMode === "list") {
    return (
      <>
        <div
          ref={cardRef}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow relative cursor-pointer"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
        <div className="flex gap-4">
          {show.imageUrl && (
            <img
              src={show.imageUrl}
              alt={show.title}
              className="w-24 h-32 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">{show.title}</h3>
                {show.theatre && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {show.theatre}
                  </p>
                )}
              </div>
              <QuickActions showId={show._id} />
            </div>
            {show.district && (
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs mb-2">
                {show.district}
              </span>
            )}
            {show.isInPreviews && (
              <span className="inline-block ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs">
                Previews
              </span>
            )}
            {show.isOpenRun && (
              <span className="inline-block ml-2 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                Open Run
              </span>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {dateRange()}
            </p>
            {show.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {show.description}
              </p>
            )}
          </div>
        </div>
      </div>
      {(isHovering || showDetails) && (
        <DetailedShowCard
          show={show}
          onClose={() => {
            setShowDetails(false);
            setIsHovering(false);
          }}
          anchorElement={cardRef.current}
        />
      )}
    </>
    );
  }

  return (
    <>
      <div
        ref={cardRef}
        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative cursor-pointer"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {show.imageUrl && (
          <img
            src={show.imageUrl}
            alt={show.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{show.title}</h3>
            <QuickActions showId={show._id} />
          </div>
          {show.theatre && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {show.theatre}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {show.district && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                {show.district}
              </span>
            )}
            {show.isInPreviews && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs">
                Previews
              </span>
            )}
            {show.isOpenRun && (
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                Open Run
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {dateRange()}
          </p>
          {show.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {show.description}
            </p>
          )}
        </div>
      </div>
      {(isHovering || showDetails) && (
        <DetailedShowCard
          show={show}
          onClose={() => {
            setShowDetails(false);
            setIsHovering(false);
          }}
          anchorElement={cardRef.current}
        />
      )}
    </>
  );
}

