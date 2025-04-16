import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ActivityCalendar from "./activity-calendar";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import party from "party-js";

export default function Activity() {
  const { data: session } = useSession();
  const [activityDates, setActivityDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [newConceptAvailable, setNewConceptAvailable] = useState(false);

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/users/${session.user.id}/activities`);
        if (!res.ok) throw new Error("Failed to fetch activities");

        const dates: string[] = await res.json();
        const parsedDates = dates.map((dateStr) => new Date(dateStr));
        setActivityDates(parsedDates);

        const today = new Date();
        const isTodayCompleted = parsedDates.some(
          (date) =>
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
        setTodayCompleted(isTodayCompleted);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [session]);

  const handleAddActivity = async () => {
    if (todayCompleted || !session?.user?.id) return;

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

          // Check if added activity is for today
          const today = new Date();
          if (
            dateObj.getFullYear() === today.getFullYear() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getDate() === today.getDate()
          ) {
            setTodayCompleted(true);

            //Trigger confetti in center of screen
            party.confetti(document.body, {
              count: 100,
              spread: 100,
              speed: 1,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  // Fetch new concept availability status & concept state
  useEffect(() => {
    const fetchConceptState = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/users/${session.user.id}/concept_state`);
        if (!res.ok) throw new Error("Failed to fetch concept state");

        const concept_state = await res.json();
        setNewConceptAvailable(concept_state.newConceptAvailable);
      } catch (error) {
        console.error("Error fetching concept state:", error);
      }
    };

    fetchConceptState();

    console.log("debug here!!!");
    console.log(todayCompleted);
    console.log(newConceptAvailable);
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex w-full py-6">
        <Button
          variant={
            todayCompleted || !newConceptAvailable ? "secondary" : "outline"
          }
          className={cn(
            "text-white px-4 py-2 text-sm w-full max-w-[200px] mx-auto md:w-fit md:ml-auto md:mr-[15%] md:px-6 md:py-4 md:text-md",
            todayCompleted || !newConceptAvailable
              ? "bg-gray-600 hover:bg-gray-600 cursor-default"
              : "bg-blue-600"
          )}
          onClick={handleAddActivity}
        >
          {todayCompleted || !newConceptAvailable ? "Completed!" : "Got It!"}
        </Button>
      </div>

      <div className="flex justify-center items-center">
        <ActivityCalendar
          activityDates={activityDates}
          startYear={new Date().getFullYear()}
          endYear={new Date().getFullYear()}
        />
      </div>
    </div>
  );
}
