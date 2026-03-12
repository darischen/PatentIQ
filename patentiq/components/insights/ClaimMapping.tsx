"use client";

import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface ClaimMappingProps {
  patentId: string;
}

export default function ClaimMapping({ patentId }: ClaimMappingProps) {
  // TODO: Fetch claim mapping data for this patent against user's analysis features

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Feature-to-Claim Mapping</CardTitle>
        <CardDescription>
          Shows how your invention features map to claims in patent {patentId}
        </CardDescription>

        <div className="mt-6 flex flex-col items-center py-12 text-center">
          <svg className="h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Complete an analysis to see how your features map to patent claims.
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Each feature will be matched against relevant claims with overlap percentages.
          </p>
        </div>
      </Card>

      {/* Mapping Legend */}
      <Card>
        <CardTitle>How to Read This Map</CardTitle>
        <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Badge variant="danger">High Overlap</Badge>
            <span>Feature closely matches one or more claims (&gt;70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">Partial Overlap</Badge>
            <span>Feature has some similarity to claims (30-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Low Overlap</Badge>
            <span>Feature is distinct from this patent's claims (&lt;30%)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
