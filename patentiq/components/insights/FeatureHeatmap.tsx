"use client";

export default function FeatureHeatmap() {
  // TODO: Render heatmap visualization using analysis data
  // Will integrate with a charting library (e.g., recharts, d3)

  return (
    <div className="flex flex-col items-center py-12 text-center">
      <svg className="h-16 w-16 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        Complete an analysis to generate the feature novelty heatmap.
      </p>
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
        The heatmap shows feature-level novelty scores with color-coded risk indicators.
      </p>
    </div>
  );
}
