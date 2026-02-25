"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Card, { CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Tabs, { TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <Header
        title="Search"
        description="Search patents and past analyses"
      />

      <div className="p-8 max-w-5xl">
        {/* Search Bar */}
        <Card className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search patents by keyword, patent number, or inventor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Search</Button>
          </div>
        </Card>

        {/* Results Tabs */}
        <Tabs defaultTab="patents">
          <TabsList>
            <TabsTrigger value="patents">Search Patents</TabsTrigger>
            <TabsTrigger value="analyses">Search Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="patents">
            <Card>
              <div className="flex flex-col items-center py-12 text-center">
                <svg className="h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                  Enter a search term to find patents from the USPTO database.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analyses">
            <Card>
              <div className="flex flex-col items-center py-12 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Search through your previous analyses by invention name, features, or domain.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
