"use client";

import Header from "@/components/layout/Header";
import Card, { CardTitle } from "@/components/ui/Card";
import PatentFilters from "@/components/insights/PatentFilters";
import PriorArtCard from "@/components/insights/PriorArtCard";

export default function PriorArtPage() {
  return (
    <div>
      <Header
        title="Prior Art Explorer"
        description="Browse prior art patents found across your analyses"
      />

      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PatentFilters />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <Card>
              <CardTitle>Prior Art Results</CardTitle>
              <div className="mt-6 flex flex-col items-center py-12 text-center">
                <svg className="h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                  Complete an analysis to see prior art results here.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
