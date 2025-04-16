"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { PhysicsConcept } from "@/types/main";

import { ShareButton } from "./share-button";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function PhysicsCard() {
  const [concept, setConcept] = useState<PhysicsConcept | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConcept = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/ai");
        const data = await response.json();
        setConcept(data.concept as PhysicsConcept);
        setTimeLeft(data.timeLeft);
      } catch (error) {
        console.error("Failed to fetch concept:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConcept();
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  if (loading || !concept) {
    return (
      <Card className="w-full max-w-3xl shadow-lg p-6 text-center">
        <p className="text-slate-500">Loading physics concept...</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">
              {concept.title}
            </CardTitle>
            <CardDescription className="mt-2">
              {timeLeft !== null && (
                <p className="text-md font-medium text-slate-950 mt-1">
                  Next concept in:{" "}
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </p>
              )}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-base md:text-sm sm:text-xs"
          >
            {concept.field}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">
            Description
          </h3>
          <p className="text-slate-700">{concept.description}</p>
        </div>

        {concept.formula !== "NONE" && (
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-2">Formula</h3>
            <div className="bg-slate-100 p-4 rounded-md text-center font-mono text-lg">
              {concept.formula}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col justify-center items-center gap-2 border-t pt-6">
        <div className="font-medium text-slate-500 text-sm">
          Share this concept on
        </div>
        <ShareButton title={concept.title} description={concept.description} />
      </CardFooter>
    </Card>
  );
}
