"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ActivityCalendar from "./activity-calendar";
import { Button } from "./ui/button";

export default function Activity() {
  const { data: session } = useSession();
  const [activityDates, setActivityDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Session:", session);
    async function fetchActivities() {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/users/${session.user.id}/activities`);
          if (!res.ok) throw new Error("Failed to fetch activities");

          const dates: string[] = await res.json();
          const parsedDates = dates.map((dateStr) => new Date(dateStr));
          setActivityDates(parsedDates);
        } catch (error) {
          console.error("Error loading activities:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("session is missing");
      }
    }

    fetchActivities();
  }, [session]);

  async function handleAddActivity() {
    if (!session?.user?.id) {
      console.log("session is missing");
      return;
    }

    try {
      const res = await fetch(`/api/users/${session.user.id}/activities`, {
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
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex justify-end pr-20">
        <Button
          variant={"outline"}
          size={"xl"}
          className="bg-blue-600 text-white"
          onClick={handleAddActivity}
        >
          Got It!
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-2 mt-5">Activity Calendar</h1>

      <ActivityCalendar
        activityDates={activityDates}
        startYear={new Date().getFullYear() - 1}
        endYear={new Date().getFullYear()}
      />
    </div>
  );
}
