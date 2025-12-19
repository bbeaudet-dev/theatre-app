"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function UserPreferences() {
  const userId = useQuery(api.functions.profile.getFirstUser);
  const preferences = useQuery(
    api.functions.profile.getUserPreferences,
    userId ? { userId } : "skip"
  );
  const updatePreferences = useMutation(
    api.functions.profile.updateUserPreferences
  );

  const [danceAppreciation, setDanceAppreciation] = useState<number>(3);
  const [liveOrchestraAppreciation, setLiveOrchestraAppreciation] =
    useState<boolean>(false);
  const [listensToSoundtracks, setListensToSoundtracks] =
    useState<boolean>(false);
  const [appreciatesStageElements, setAppreciatesStageElements] =
    useState<number>(3);
  const [appreciatesPropEfficiency, setAppreciatesPropEfficiency] =
    useState<number>(3);
  const [valuesMessageMoral, setValuesMessageMoral] = useState<number>(3);
  const [valuesActorQuality, setValuesActorQuality] = useState<number>(3);

  useEffect(() => {
    if (preferences) {
      setDanceAppreciation(preferences.danceAppreciation || 3);
      setLiveOrchestraAppreciation(
        preferences.liveOrchestraAppreciation || false
      );
      setListensToSoundtracks(preferences.listensToSoundtracks || false);
      setAppreciatesStageElements(preferences.appreciatesStageElements || 3);
      setAppreciatesPropEfficiency(preferences.appreciatesPropEfficiency || 3);
      setValuesMessageMoral(preferences.valuesMessageMoral || 3);
      setValuesActorQuality(preferences.valuesActorQuality || 3);
    }
  }, [preferences]);

  const handleSave = async () => {
    if (!userId) {
      alert("Please seed the database first");
      return;
    }

    try {
      await updatePreferences({
        userId,
        danceAppreciation,
        liveOrchestraAppreciation,
        listensToSoundtracks,
        appreciatesStageElements,
        appreciatesPropEfficiency,
        valuesMessageMoral,
        valuesActorQuality,
      });
      alert("Preferences saved!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences");
    }
  };

  if (userId === undefined || preferences === undefined) {
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
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold">Theatre Preferences</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            How much do you appreciate good dance in a show? (1-5): {danceAppreciation}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={danceAppreciation}
            onChange={(e) => setDanceAppreciation(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={liveOrchestraAppreciation}
              onChange={(e) => setLiveOrchestraAppreciation(e.target.checked)}
            />
            <span>Do you appreciate a live orchestra?</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={listensToSoundtracks}
              onChange={(e) => setListensToSoundtracks(e.target.checked)}
            />
            <span>
              Do you enjoy listening to soundtracks/songs from musicals in your
              daily life?
            </span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            How much do you appreciate unique stage elements? (1-5): {appreciatesStageElements}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={appreciatesStageElements}
            onChange={(e) =>
              setAppreciatesStageElements(parseInt(e.target.value))
            }
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            How much do you appreciate prop efficiency? (1-5): {appreciatesPropEfficiency}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={appreciatesPropEfficiency}
            onChange={(e) =>
              setAppreciatesPropEfficiency(parseInt(e.target.value))
            }
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            How much do you value the message/moral of the story? (1-5): {valuesMessageMoral}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={valuesMessageMoral}
            onChange={(e) => setValuesMessageMoral(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            How much do you value actor quality? (1-5): {valuesActorQuality}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={valuesActorQuality}
            onChange={(e) => setValuesActorQuality(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

