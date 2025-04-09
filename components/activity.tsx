"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ActivityCalendar from "./activity-calendar";

export default function Activity() {
  const { data: session } = useSession();
  const [activityDates, setActivityDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      if (session?.user?.id && typeof session.user.id === "string") {
        try {
          const res = await fetch(`/api/user/${session.user.id}/activities`);
          if (!res.ok) throw new Error("Failed to fetch activities");

          const dates: string[] = await res.json();
          const parsedDates = dates.map((dateStr) => new Date(dateStr));
          setActivityDates(parsedDates);
        } catch (error) {
          console.error("Error loading activities:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchActivities();
  }, [session]);

  async function handleAddActivity() {
    if (!session?.user?.id || typeof session.user.id !== "string") return;

    try {
      const res = await fetch(`/api/user/${session.user.id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error("Failed to add activity");

      const newActivity = await res.json();

      if (newActivity?.date) {
        const dateObj = new Date(newActivity.date);
        const alreadyExists = activityDates.some(
          (d) =>
            d.getFullYear() === dateObj.getFullYear() &&
            d.getMonth() === dateObj.getMonth() &&
            d.getDate() === dateObj.getDate()
        );

        if (!alreadyExists) {
          setActivityDates((prev) => [...prev, dateObj]);
        }
      }
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Activity Calendar</h1>

      <button
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mb-5 transition-colors"
        onClick={handleAddActivity}
      >
        {`Log Today's Activity`}
      </button>

      <ActivityCalendar
        activityDates={activityDates}
        startYear={new Date().getFullYear() - 1}
        endYear={new Date().getFullYear()}
      />
    </div>
  );
}
