"use client";

import Card, { CardTitle, CardDescription } from "@/components/ui/Card";

export default function AlertSettings() {
  return (
    <Card>
      <CardTitle>Alert Configuration</CardTitle>
      <CardDescription>
        Configure what triggers patent alerts for your inventions
      </CardDescription>

      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              New Prior Art Alerts
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Alert when new patents are published matching your features
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Score Change Alerts
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Alert when new patents could affect your novelty score
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              CPC Category Monitoring
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Monitor specific CPC categories for new filings
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>
    </Card>
  );
}
