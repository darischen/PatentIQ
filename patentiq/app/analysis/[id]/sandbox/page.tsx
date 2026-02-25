"use client";

import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StrategyControls from "@/components/analysis/StrategyControls";

export default function SandboxPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <Header
        title="Strategy Sandbox"
        description="Interactively explore how features affect your novelty score"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Reset</Button>
            <Button size="sm">Save Configuration</Button>
          </div>
        }
      />

      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Feature Toggles */}
          <div className="lg:col-span-1">
            <Card>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Toggle features on/off to see score impact</CardDescription>
              <div className="mt-4">
                <StrategyControls analysisId={id} />
              </div>
            </Card>
          </div>

          {/* Live Novelty Score & Visuals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Score */}
            <Card>
              <CardTitle>Live Novelty Score</CardTitle>
              <div className="mt-4 flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-5xl font-bold text-zinc-300 dark:text-zinc-600">--</p>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">XNS&#8482; Score</p>
                </div>
              </div>
            </Card>

            {/* Claim Overlap View */}
            <Card>
              <CardTitle>Claim Overlap View</CardTitle>
              <div className="mt-4 flex flex-col items-center py-8 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Toggle features to see claim overlap analysis
                </p>
              </div>
            </Card>

            {/* Feature Heatmap */}
            <Card>
              <CardTitle>Feature Heatmap</CardTitle>
              <div className="mt-4 flex flex-col items-center py-8 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Visual heatmap of feature novelty will appear here
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
