import Header from "@/components/layout/Header";
import Card, { CardTitle } from "@/components/ui/Card";
import Tabs, { TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

export default function VersionsPage() {
  return (
    <div>
      <Header
        title="Version Management"
        description="Manage saved reports and analysis version history"
      />

      <div className="p-8 max-w-5xl">
        <Tabs defaultTab="saved">
          <TabsList>
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
            <TabsTrigger value="history">Version History</TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            <Card>
              <CardTitle>Saved Reports</CardTitle>
              <div className="mt-4 flex flex-col items-center py-12 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No saved reports yet. Save an analysis to create a report.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardTitle>Version History</CardTitle>
              <div className="mt-4 flex flex-col items-center py-12 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Version history tracks changes to your analyses over time.
                  Re-run analyses to create new versions.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
