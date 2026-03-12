"use client";

import { useState, useEffect } from "react";

interface Feature {
  id: string;
  name: string;
  enabled: boolean;
}

interface StrategyControlsProps {
  analysisId: string;
}

export default function StrategyControls({ analysisId }: StrategyControlsProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSandboxState() {
      try {
        const response = await fetch(`/api/analysis/${analysisId}/sandbox`);
        if (response.ok) {
          const data = await response.json();
          // TODO: Populate features from sandbox state
          setFeatures([]);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSandboxState();
  }, [analysisId]);

  async function handleToggle(featureId: string, enabled: boolean) {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, enabled } : f))
    );

    // TODO: Call sandbox API to recalculate scores
    await fetch(`/api/analysis/${analysisId}/sandbox`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featureId, enabled }),
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4">
        Complete an analysis first to use the strategy sandbox.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {features.map((feature) => (
        <div key={feature.id} className="flex items-center justify-between">
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            {feature.name}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={feature.enabled}
              onChange={(e) => handleToggle(feature.id, e.target.checked)}
            />
            <div className="w-9 h-5 bg-zinc-200 peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>
      ))}
    </div>
  );
}
