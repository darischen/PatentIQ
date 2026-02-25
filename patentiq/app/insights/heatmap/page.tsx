"use client";

import Header from "@/components/layout/Header";
import Card, { CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FeatureHeatmap from "@/components/insights/FeatureHeatmap";

export default function HeatmapPage() {
  return (
    <div>
      <Header
        title="Feature Heatmap"
        description="Visual overview of feature novelty across analyses"
      />

      <div className="p-8">
        <Card>
          <CardTitle>Novelty Heatmap</CardTitle>
          <div className="mt-4">
            <FeatureHeatmap />
          </div>
        </Card>

        {/* Legend */}
        <Card className="mt-6">
          <CardTitle>Legend</CardTitle>
          <div className="mt-3 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-green-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">High Novelty (70-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-yellow-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Moderate Risk (40-69)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-red-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">High Risk (0-39)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
