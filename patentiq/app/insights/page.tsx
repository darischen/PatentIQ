import Link from "next/link";
import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";

export default function InsightsPage() {
  return (
    <div>
      <Header
        title="Insights & Exploration"
        description="Explore patent landscapes, prior art, and feature analysis"
      />

      <div className="p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/insights/heatmap">
            <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 mb-3">
                <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <CardTitle>Feature Heatmap</CardTitle>
              <CardDescription>
                Visual overview of feature novelty scores across your analyses
              </CardDescription>
            </Card>
          </Link>

          <Link href="/insights/prior-art">
            <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 mb-3">
                <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <CardTitle>Prior Art Explorer</CardTitle>
              <CardDescription>
                Browse and explore prior art patents found in your analyses
              </CardDescription>
            </Card>
          </Link>

          <Link href="/insights/search">
            <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-3">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <CardTitle>Search</CardTitle>
              <CardDescription>
                Search patents and past analyses
              </CardDescription>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
