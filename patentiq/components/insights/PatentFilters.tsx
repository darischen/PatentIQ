"use client";

import { useState } from "react";
import Card, { CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function PatentFilters() {
  const [riskLevel, setRiskLevel] = useState<string>("all");
  const [featureType, setFeatureType] = useState<string>("all");
  const [patentStatus, setPatentStatus] = useState<string>("all");

  return (
    <Card>
      <CardTitle>Filters</CardTitle>

      <div className="mt-4 space-y-5">
        {/* By Risk Level */}
        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            By Risk Level
          </p>
          <div className="space-y-1.5">
            {["all", "high", "medium", "low"].map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="riskLevel"
                  value={level}
                  checked={riskLevel === level}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* By Feature Type */}
        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            By Feature Type
          </p>
          <select
            value={featureType}
            onChange={(e) => setFeatureType(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="all">All Types</option>
            <option value="method">Method</option>
            <option value="apparatus">Apparatus</option>
            <option value="composition">Composition</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* By Patent Status */}
        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            By Patent Status
          </p>
          <div className="space-y-1.5">
            {[
              { value: "all", label: "All" },
              { value: "granted", label: "Granted" },
              { value: "pending", label: "Pending" },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="patentStatus"
                  value={option.value}
                  checked={patentStatus === option.value}
                  onChange={(e) => setPatentStatus(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}
