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

export function PhysicsCard() {
  const [concept, setConcept] = useState<PhysicsConcept | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConcept = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/ai");
        const data = await response.json();
        setConcept(data as PhysicsConcept);
      } catch (error) {
        console.error("Failed to fetch concept:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConcept();
  }, []);

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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">
              {concept.title}
            </CardTitle>
            <CardDescription className="mt-2">
              {`Today's Physics Concept`}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
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

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Formula</h3>
          <div className="bg-slate-100 p-4 rounded-md text-center font-mono text-lg">
            {concept.formula}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">
            Additional Information
          </h3>
          <p className="text-slate-700">{concept.additionalInfo}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        {/* Footer kept for spacing/design consistency; can be removed if unnecessary */}
      </CardFooter>
    </Card>
  );
}
