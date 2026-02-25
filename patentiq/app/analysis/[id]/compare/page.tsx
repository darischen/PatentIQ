"use client";

import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tabs, { TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

export default function ComparePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <Header
        title="Compare & Related"
        description="Compare idea versions and view similar analyses"
      />

      <div className="p-8 max-w-5xl">
        <Tabs defaultTab="versions">
          <TabsList>
            <TabsTrigger value="versions">Compare Idea Versions</TabsTrigger>
            <TabsTrigger value="similar">View Similar Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="versions">
            <Card>
              <CardTitle>Version Comparison</CardTitle>
              <CardDescription>Compare different versions of your analysis side by side</CardDescription>
              <div className="mt-6 flex flex-col items-center py-12 text-center">
                <svg className="h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                  Re-run your analysis to create multiple versions for comparison.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="similar">
            <Card>
              <CardTitle>Similar Analyses</CardTitle>
              <CardDescription>Analyses with similar invention features or domains</CardDescription>
              <div className="mt-6 flex flex-col items-center py-12 text-center">
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                  No similar analyses found yet. Complete more analyses to see related results.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
