"use client";

import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AlertSettings from "@/components/reports/AlertSettings";

export default function MonitoringPage() {
  return (
    <div>
      <Header
        title="Monitoring"
        description="Patent alerts and monitoring configuration"
      />

      <div className="p-8 max-w-4xl">
        {/* Enable Patent Alerts */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patent Alerts</CardTitle>
              <CardDescription>
                Get notified when new patents are published that may affect your inventions
              </CardDescription>
            </div>
            <Button size="sm">Enable Alerts</Button>
          </div>
        </Card>

        {/* Alert Settings */}
        <AlertSettings />

        {/* Alert History */}
        <Card className="mt-6">
          <CardTitle>Alert History</CardTitle>
          <div className="mt-4 flex flex-col items-center py-8 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No alerts yet. Enable patent monitoring to start receiving alerts.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
