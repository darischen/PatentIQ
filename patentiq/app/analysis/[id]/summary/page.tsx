"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Card, { CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import NoveltyScore from "@/components/analysis/NoveltyScore";
import RiskOverview from "@/components/analysis/RiskOverview";

export default function SummaryPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <Header
        title="Baseline Analysis Summary"
        description="Novelty score, key risks, and closest prior art"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Export PDF</Button>
            <Link href={`/analysis/${id}/sandbox`}>
              <Button size="sm">Open Strategy Sandbox</Button>
            </Link>
          </div>
        }
      />

      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Context Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardTitle>Context Overview</CardTitle>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Analysis results will appear here once processing is complete.
                The AI will provide a summary of your invention context, identified
                technical domain, and key aspects analyzed.
              </p>
            </Card>
          </div>

          {/* Novelty Score */}
          <div>
            <NoveltyScore score={null} />
          </div>
        </div>

        {/* Key Risks & Overlap */}
        <div className="mt-6">
          <RiskOverview risks={[]} />
        </div>

        {/* Closest Prior Art */}
        <div className="mt-6">
          <Card>
            <CardTitle>Closest Prior Art</CardTitle>
            <div className="mt-4 flex flex-col items-center py-8 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Prior art results will appear after analysis completes.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
