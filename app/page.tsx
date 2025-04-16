"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

import { Header } from "@/components/header";
import { PhysicsCard } from "@/components/physics-card";
import Activity from "@/components/activity";

export default function Home() {
  const { status } = useSession();

  const slogans = [
    "A New Spark of Physics, Every 24 Hours.",
    "Master Physics One Day at a Time.",
    "Your Daily Dose of the Universe.",
    "Physics, Bit by Bit – Daily.",
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isPaused) return;

    const fadeOutTimeout = setTimeout(() => setFade(false), 9500);
    const interval = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slogans.length);
      setFade(true);

      if ((index + 1) % slogans.length === 0) {
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 20000);
      }
    }, 10000); // switch every 5s

    return () => {
      clearTimeout(interval);
      clearTimeout(fadeOutTimeout);
    };
  }, [index, isPaused, slogans.length]);

  return (
    <div>
      <Header />
      <div className="flex-1 flex-col container mx-auto px-4 py-15 flex items-center justify-center">
        <div
          className={cn(
            "transition-opacity duration-500 text-lg md:text-2xl text-blue-700 font-semibold pb-10",
            fade ? "opacity-100" : "opacity-0"
          )}
        >
          {slogans[index]}
        </div>
        <PhysicsCard />
        {status === "authenticated" && <Activity />}
      </div>
    </div>
  );
}
