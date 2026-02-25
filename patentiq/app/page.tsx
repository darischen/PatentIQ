import Link from "next/link";
import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div>
      <Header
        title="Dashboard"
        description="Welcome to PatentIQ - AI Patent Intelligence Platform"
        actions={
          <Link href="/analysis/new">
            <Button>New Analysis</Button>
          </Link>
        }
      />

      <div className="p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Analyses</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">0</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Avg. Novelty Score</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">--</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Patents Analyzed</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">0</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Alerts</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">0</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/analysis/new">
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardTitle>Start New Analysis</CardTitle>
                <CardDescription>
                  Submit your invention idea and get AI-powered patent novelty analysis
                </CardDescription>
              </Card>
            </Link>
            <Link href="/insights/search">
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardTitle>Search Patents</CardTitle>
                <CardDescription>
                  Explore the USPTO patent database and find relevant prior art
                </CardDescription>
              </Card>
            </Link>
            <Link href="/insights/heatmap">
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardTitle>Feature Heatmap</CardTitle>
                <CardDescription>
                  Visualize feature novelty across your analyses
                </CardDescription>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Recent Analyses</h2>
          <Card>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                No analyses yet. Start your first analysis to see results here.
              </p>
              <Link href="/analysis/new" className="mt-4">
                <Button variant="outline" size="sm">Create First Analysis</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
