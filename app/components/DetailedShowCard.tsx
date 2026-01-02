"use client";

import { useState, useRef, useEffect } from "react";
import { Show } from "@/lib/types";
import { DAYS_OF_WEEK, DAY_LABELS_SHORT } from "@/lib/constants";

interface DetailedShowCardProps {
  show: Show;
  onClose?: () => void;
  anchorElement?: HTMLElement | null;
}

export default function DetailedShowCard({
  show,
  onClose,
  anchorElement,
}: DetailedShowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  // Calculate position based on anchor element
  useEffect(() => {
    if (!anchorElement) return;

    const updatePosition = () => {
      const rect = anchorElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      // Position below the anchor element, aligned to left
      const top = rect.bottom + scrollY + 10;
      let left = rect.left + scrollX;

      // Adjust if card would overflow right side of viewport
      if (left + 448 > window.innerWidth + scrollX) {
        left = window.innerWidth + scrollX - 448 - 20; // 448 = max-w-md (28rem)
      }

      // Adjust if card would overflow left side
      if (left < scrollX + 20) {
        left = scrollX + 20;
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [anchorElement]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target as Node) &&
        anchorElement &&
        !anchorElement.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    if (onClose) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [onClose, anchorElement]);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShowtimes = () => {
    if (!show.showtimes) return null;

    return DAYS_OF_WEEK.map((day, idx) => {
      const times = show.showtimes?.[day as keyof typeof show.showtimes];
      if (!times || times.length === 0) return null;
      return `${DAY_LABELS_SHORT[idx]}: ${times.join(", ")}`;
    })
      .filter(Boolean)
      .join(" • ");
  };

  if (!position && anchorElement) {
    return null; // Wait for position calculation
  }

  return (
    <div
      ref={cardRef}
      className="fixed z-50 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-gray-200 dark:border-zinc-700 p-6 max-w-md w-[calc(100vw-2rem)] sm:w-full max-h-[80vh] overflow-y-auto"
      style={
        position
          ? {
              top: `${position.top}px`,
              left: `${position.left}px`,
            }
          : undefined
      }
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Show Image */}
      {show.imageUrl && (
        <img
          src={show.imageUrl}
          alt={show.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      {/* Title */}
      <h2 className="text-2xl font-bold mb-3">{show.title}</h2>

      {/* Theatre & District */}
      <div className="space-y-2 mb-4">
        {show.theatre && (
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Theatre:</span> {show.theatre}
          </p>
        )}
        {show.district && (
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
            {show.district}
          </span>
        )}
      </div>

      {/* Dates */}
      <div className="mb-4 space-y-1">
        {show.previewDate && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Preview:</span> {formatDate(show.previewDate)}
          </p>
        )}
        {show.openingDate && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Opening:</span> {formatDate(show.openingDate)}
          </p>
        )}
        {show.closingDate && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Closing:</span> {formatDate(show.closingDate)}
          </p>
        )}
        {show.isOpenRun && (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
            Open Run
          </span>
        )}
      </div>

      {/* Showtimes */}
      {formatShowtimes() && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-1">Showtimes:</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatShowtimes()}
          </p>
        </div>
      )}

      {/* Description */}
      {show.description && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Description:</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {show.description}
          </p>
        </div>
      )}

      {/* Additional Info */}
      {(show.venue || show.location) && (
        <div className="mb-4 space-y-1">
          {show.venue && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Venue:</span> {show.venue}
            </p>
          )}
          {show.location && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Location:</span> {show.location}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

