import Link from "next/link";
import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisOverviewPage({ params }: AnalysisPageProps) {
  const { id } = await params;

  return (
    <div>
      <Header
        title="Analysis Overview"
        description={`Analysis ID: ${id}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Export Summary</Button>
            <Button variant="outline" size="sm">Re-run Analysis</Button>
            <Button size="sm">Save Analysis</Button>
          </div>
        }
      />

      <div className="p-8">
        {/* Analysis Status */}
        <div className="mb-6 flex items-center gap-3">
          <Badge variant="info">Processing</Badge>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Analysis started - extracting features...
          </span>
        </div>

        {/* Analysis Steps Navigation */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href={`/analysis/${id}/features`}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardTitle>Feature Extraction</CardTitle>
              <CardDescription>View and edit extracted features</CardDescription>
              <Badge variant="warning" className="mt-3">Pending</Badge>
            </Card>
          </Link>

          <Link href={`/analysis/${id}/summary`}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardTitle>Baseline Summary</CardTitle>
              <CardDescription>Novelty score, risks, and prior art</CardDescription>
              <Badge className="mt-3">Waiting</Badge>
            </Card>
          </Link>

          <Link href={`/analysis/${id}/sandbox`}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardTitle>Strategy Sandbox</CardTitle>
              <CardDescription>Interactive feature exploration</CardDescription>
              <Badge className="mt-3">Waiting</Badge>
            </Card>
          </Link>

          <Link href={`/analysis/${id}/compare`}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardTitle>Compare & Related</CardTitle>
              <CardDescription>Compare versions, view similar</CardDescription>
              <Badge className="mt-3">Waiting</Badge>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
