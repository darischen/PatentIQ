import Link from "next/link";
import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ReportsPage() {
  return (
    <div>
      <Header
        title="Reports & Monitoring"
        description="View analysis reports, manage alerts, and track versions"
      />

      <div className="p-8">
        {/* Quick Links */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
          <Link href="/reports/monitoring">
            <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
              <CardTitle>Monitoring</CardTitle>
              <CardDescription>Patent alerts and monitoring history</CardDescription>
            </Card>
          </Link>
          <Link href="/reports/versions">
            <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
              <CardTitle>Version Management</CardTitle>
              <CardDescription>Saved reports and version history</CardDescription>
            </Card>
          </Link>
          <Link href="/downloads">
            <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
              <CardTitle>Downloads</CardTitle>
              <CardDescription>Export PDF, visual summary, or data</CardDescription>
            </Card>
          </Link>
        </div>

        {/* Analysis Reports */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Analysis Reports</CardTitle>
            <Button variant="outline" size="sm">Export PDF</Button>
          </div>
          <div className="flex flex-col items-center py-12 text-center">
            <svg className="h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Complete an analysis to generate reports.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
