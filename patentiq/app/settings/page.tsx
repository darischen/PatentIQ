"use client";

import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <div>
      <Header
        title="Settings"
        description="Manage your account and platform preferences"
      />

      <div className="p-8 max-w-3xl">
        <div className="space-y-6">
          {/* Notification Preferences */}
          <Card>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Control how and when you receive notifications</CardDescription>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Email Notifications</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Receive email for analysis completions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Patent Alerts</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Notify when new relevant patents are published</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Data Scope */}
          <Card>
            <CardTitle>Data Scope</CardTitle>
            <CardDescription>Configure patent data sources (future feature)</CardDescription>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="uspto" defaultChecked disabled className="rounded border-zinc-300" />
                <label htmlFor="uspto" className="text-sm text-zinc-700 dark:text-zinc-300">USPTO (United States)</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="wipo" disabled className="rounded border-zinc-300" />
                <label htmlFor="wipo" className="text-sm text-zinc-400">WIPO (International) - Coming Soon</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="epo" disabled className="rounded border-zinc-300" />
                <label htmlFor="epo" className="text-sm text-zinc-400">EPO (European) - Coming Soon</label>
              </div>
            </div>
          </Card>

          {/* Account */}
          <Card>
            <CardTitle>Account</CardTitle>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" size="sm">Manage Account</Button>
              <Button variant="danger" size="sm">Sign Out</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
