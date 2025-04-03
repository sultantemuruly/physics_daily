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
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const physicsConcepts = [
  {
    title: "Newton's First Law of Motion",
    description:
      "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an external force.",
    formula: "∑F = 0 ⟹ a = 0",
    field: "Classical Mechanics",
    additionalInfo:
      "Also known as the law of inertia, this fundamental principle forms the foundation of classical mechanics and was first formulated by Sir Isaac Newton in his work Philosophiæ Naturalis Principia Mathematica in 1687.",
  },
  {
    title: "Bernoulli's Principle",
    description:
      "In fluid dynamics, an increase in the speed of a fluid occurs simultaneously with a decrease in pressure or a decrease in the fluid's potential energy.",
    formula: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂",
    field: "Fluid Dynamics",
    additionalInfo:
      "Named after Swiss mathematician Daniel Bernoulli, this principle explains many practical phenomena such as how airplane wings generate lift and how carburetors work in engines.",
  },
  {
    title: "Einstein's Mass-Energy Equivalence",
    description:
      "Energy and mass are interchangeable; energy equals mass multiplied by the speed of light squared.",
    formula: "E = mc²",
    field: "Relativity",
    additionalInfo:
      "This equation, published by Albert Einstein in 1905, revolutionized physics by showing that mass and energy are different forms of the same thing. It's the theoretical basis for nuclear energy production.",
  },
  {
    title: "Schrödinger's Equation",
    description:
      "A fundamental equation in quantum mechanics that describes how the quantum state of a physical system changes over time.",
    formula: "iℏ ∂Ψ/∂t = ĤΨ",
    field: "Quantum Mechanics",
    additionalInfo:
      "Developed by Erwin Schrödinger in 1925, this equation is to quantum mechanics what Newton's laws are to classical mechanics - a fundamental mathematical description of behavior.",
  },
  {
    title: "Ohm's Law",
    description:
      "The current through a conductor between two points is directly proportional to the voltage across the two points.",
    formula: "V = IR",
    field: "Electromagnetism",
    additionalInfo:
      "Named after German physicist Georg Ohm, this relationship is fundamental to circuit design and electrical engineering. It states that voltage equals current multiplied by resistance.",
  },
];

export function PhysicsCard() {
  const [concept, setConcept] = useState(physicsConcepts[0]);
  const [loading, setLoading] = useState(false);

  const getRandomConcept = () => {
    setLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * physicsConcepts.length);
      setConcept(physicsConcepts[randomIndex]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    getRandomConcept();
  }, []);

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
        <Button
          onClick={getRandomConcept}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Show Another Concept
        </Button>
      </CardFooter>
    </Card>
  );
}
