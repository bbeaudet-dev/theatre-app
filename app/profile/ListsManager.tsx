"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import ListManager from "../browse/ListManager";
import ShowCard from "../browse/ShowCard";

export default function ListsManager() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const userId = useQuery(api.functions.profile.getFirstUser);
  const lists = useQuery(
    api.functions.profile.getUserLists,
    userId ? { userId } : "skip"
  );
  const allShows = useQuery(api.functions.shows.getShows, {});
  const deleteList = useMutation(api.functions.profile.deleteList);

  const handleDelete = async (listId: string) => {
    if (confirm("Are you sure you want to delete this list?")) {
      try {
        await deleteList({ listId: listId as any });
      } catch (error) {
        console.error("Error deleting list:", error);
        alert("Failed to delete list");
      }
    }
  };

  if (userId === undefined || lists === undefined) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        Please seed the database first to create a user.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Lists</h2>
        <button
          onClick={() => {
            setEditingListId(null);
            setShowCreateForm(true);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New List
        </button>
      </div>

      {showCreateForm && (
        <ListManager
          listId={editingListId}
          onClose={() => {
            setShowCreateForm(false);
            setEditingListId(null);
          }}
        />
      )}

      {lists.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          You don't have any lists yet. Create one to get started!
        </div>
      ) : (
        <div className="space-y-6">
          {lists.map((list) => {
            const listShows =
              allShows?.filter((show) => list.showIds.includes(show._id)) || [];

            return (
              <div
                key={list._id}
                className="bg-white dark:bg-zinc-900 border rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{list.title}</h3>
                    {list.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {list.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {listShows.length} show{listShows.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingListId(list._id);
                        setShowCreateForm(true);
                      }}
                      className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(list._id)}
                      className="px-4 py-2 border rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {listShows.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    No shows in this list yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {listShows.map((show) => (
                      <ShowCard key={show._id} show={show} viewMode="grid" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

