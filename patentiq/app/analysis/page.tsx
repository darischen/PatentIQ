import Link from "next/link";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function AnalysisListPage() {
  return (
    <div>
      <Header
        title="My Analyses"
        description="View and manage your patent novelty analyses"
        actions={
          <Link href="/analysis/new">
            <Button>New Analysis</Button>
          </Link>
        }
      />

      <div className="p-8">
        {/* Filters */}
        <div className="mb-6 flex items-center gap-3">
          <Badge variant="info">All</Badge>
          <Badge>Completed</Badge>
          <Badge>In Progress</Badge>
          <Badge>Draft</Badge>
        </div>

        {/* Analysis List - Empty State */}
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="h-16 w-16 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              No analyses yet
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
              Start your first patent novelty analysis by submitting your invention idea.
              Our AI will extract features, search prior art, and calculate a novelty score.
            </p>
            <Link href="/analysis/new" className="mt-6">
              <Button>Start Your First Analysis</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
