import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DownloadsPage() {
  return (
    <div>
      <Header
        title="Downloads"
        description="Export your analysis data in various formats"
      />

      <div className="p-8 max-w-4xl">
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Download PDF Report</CardTitle>
                <CardDescription>
                  Full analysis report with novelty scores, risk assessment, and prior art citations
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" disabled>Download PDF</Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Download Visual Summary</CardTitle>
                <CardDescription>
                  Visual summary including feature heatmap and claim overlap charts
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" disabled>Download Visual</Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Download Data Snapshot</CardTitle>
                <CardDescription>
                  Raw analysis data in JSON format for custom processing
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" disabled>Download JSON</Button>
            </div>
          </Card>
        </div>

        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Complete at least one analysis to enable downloads.
        </p>
      </div>
    </div>
  );
}
