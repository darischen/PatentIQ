import Header from "@/components/layout/Header";
import Card, { CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface PatentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatentDetailPage({ params }: PatentDetailPageProps) {
  const { id } = await params;

  return (
    <div>
      <Header
        title="Patent Detail View"
        description={`Patent ID: ${id}`}
        actions={
          <Link href={`/insights/patents/${id}/claims`}>
            <Button variant="outline" size="sm">View Feature-to-Claim Mapping</Button>
          </Link>
        }
      />

      <div className="p-8 max-w-5xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Patent Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardTitle>Patent Information</CardTitle>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">Title</p>
                  <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">Loading...</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">Abstract</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Loading...</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">Filing Date</p>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">--</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">Status</p>
                    <Badge variant="success" className="mt-1">--</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            <Card>
              <CardTitle>Similarity Score</CardTitle>
              <p className="mt-2 text-3xl font-bold text-zinc-300 dark:text-zinc-600">--%</p>
            </Card>
            <Card>
              <CardTitle>CPC Codes</CardTitle>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge>Loading...</Badge>
              </div>
            </Card>
          </div>
        </div>

        {/* Claims */}
        <Card className="mt-6">
          <CardTitle>Patent Claims</CardTitle>
          <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Claims will be loaded here.
          </div>
        </Card>
      </div>
    </div>
  );
}
