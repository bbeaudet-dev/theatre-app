"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/lib/auth-client";
import ShowCard from "./ShowCard";

interface ListManagerProps {
  listId: string | null;
  onClose: () => void;
}

export default function ListManager({ listId, onClose }: ListManagerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showSelector, setShowSelector] = useState(false);
  const userId = useCurrentUser();
  const existingList = useQuery(
    api.functions.profile.getUserLists,
    userId && listId ? { userId } : "skip"
  );
  const allShows = useQuery(api.functions.shows.getShows, {});
  const createList = useMutation(api.functions.profile.createList);
  const updateList = useMutation(api.functions.profile.updateList);
  const addShowToList = useMutation(api.functions.profile.addShowToList);
  const removeShowFromList = useMutation(
    api.functions.profile.removeShowFromList
  );

  const currentList = existingList?.find((l) => l._id === listId);
  const [selectedShowIds, setSelectedShowIds] = useState<Id<"shows">[]>([]);

  useEffect(() => {
    if (currentList) {
      setTitle(currentList.title);
      setDescription(currentList.description || "");
      setSelectedShowIds(currentList.showIds);
    }
  }, [currentList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("Please sign in first");
      return;
    }

    try {
      if (listId && currentList) {
        await updateList({
          listId: listId as Id<"userLists">,
          title,
          description: description || undefined,
          showIds: selectedShowIds,
        });
      } else {
        const newListId = await createList({
          userId,
          title,
          description: description || undefined,
        });
        // Add shows to the new list
        for (const showId of selectedShowIds) {
          await addShowToList({
            listId: newListId,
            showId,
          });
        }
      }
      onClose();
    } catch (error) {
      console.error("Error saving list:", error);
      alert("Failed to save list");
    }
  };

  const handleAddShow = (showId: Id<"shows">) => {
    if (!selectedShowIds.includes(showId)) {
      setSelectedShowIds([...selectedShowIds, showId]);
    }
    setShowSelector(false);
  };

  const handleRemoveShow = (showId: Id<"shows">) => {
    setSelectedShowIds(selectedShowIds.filter((id) => id !== showId));
  };

  const selectedShows =
    allShows?.filter((show) => selectedShowIds.includes(show._id)) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {listId ? "Edit List" : "Create New List"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              rows={3}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Shows ({selectedShowIds.length})
              </label>
              <button
                type="button"
                onClick={() => setShowSelector(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Add Show
              </button>
            </div>

            {selectedShows.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 py-4 text-center border rounded">
                No shows added yet. Click "Add Show" to add shows to this list.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedShows.map((show) => (
                  <div key={show._id} className="relative">
                    <ShowCard show={show} viewMode="grid" />
                    <button
                      type="button"
                      onClick={() => handleRemoveShow(show._id)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {listId ? "Update" : "Create"} List
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </form>

        {showSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Select Shows</h3>
                <button
                  onClick={() => setShowSelector(false)}
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allShows
                  ?.filter((show) => !selectedShowIds.includes(show._id))
                  .map((show) => (
                    <div
                      key={show._id}
                      onClick={() => handleAddShow(show._id)}
                      className="cursor-pointer"
                    >
                      <ShowCard show={show} viewMode="grid" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

