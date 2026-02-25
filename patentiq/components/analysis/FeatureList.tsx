"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  confidence: number;
  isNovel: boolean | null;
}

interface FeatureListProps {
  analysisId: string;
}

export default function FeatureList({ analysisId }: FeatureListProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatures() {
      try {
        const response = await fetch(`/api/analysis/${analysisId}/features`);
        if (response.ok) {
          const data = await response.json();
          setFeatures(data.features || []);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchFeatures();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <Card className="bg-zinc-50 dark:bg-zinc-800/50">
        <div className="flex flex-col items-center py-8 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No features extracted yet. Features will appear here after processing.
          </p>
          <Button size="sm" className="mt-4">
            Extract Features
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {features.map((feature) => (
        <Card key={feature.id} padding="sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                  {feature.name}
                </h4>
                <Badge>{feature.category}</Badge>
                {feature.isNovel === true && <Badge variant="success">Novel</Badge>}
                {feature.isNovel === false && <Badge variant="danger">Existing</Badge>}
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Confidence: {Math.round(feature.confidence * 100)}%
              </p>
            </div>
            <div className="flex gap-1 ml-4">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Remove</Button>
            </div>
          </div>
        </Card>
      ))}

      <Button variant="outline" size="sm" className="w-full">
        + Add Feature Manually
      </Button>
    </div>
  );
}
