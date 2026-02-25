"use client";

import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FeatureList from "@/components/analysis/FeatureList";

export default function FeaturesPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <Header
        title="Feature Extraction"
        description="Review and edit the AI-extracted features from your invention"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Re-extract</Button>
            <Button size="sm">Continue to Analysis</Button>
          </div>
        }
      />

      <div className="p-8">
        {/* Extracted Features Preview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Extracted Features
            </h2>
            <Badge variant="info">AI-Generated - Review Recommended</Badge>
          </div>

          <FeatureList analysisId={id} />
        </div>

        {/* Edit Instructions */}
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            You can edit, add, or remove features before proceeding to the analysis step.
            More accurate features lead to better novelty scoring results.
          </p>
        </Card>
      </div>
    </div>
  );
}
