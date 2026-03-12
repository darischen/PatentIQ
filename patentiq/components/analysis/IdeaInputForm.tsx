"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function IdeaInputForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technicalField, setTechnicalField] = useState("");
  const [problemSolved, setProblemSolved] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          inputMethod: "guided",
          inputContent: JSON.stringify({
            description,
            technicalField,
            problemSolved,
          }),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = `/analysis/${data.id}/features`;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        Guided Idea Submission
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="title"
          label="Invention Title"
          placeholder="e.g., Smart Energy-Harvesting IoT Sensor"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Invention Description
          </label>
          <textarea
            id="description"
            rows={6}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Describe your invention in detail. Include the key technical aspects, how it works, and what makes it unique..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <Input
          id="technicalField"
          label="Technical Field"
          placeholder="e.g., Internet of Things, Energy Harvesting, Sensor Networks"
          value={technicalField}
          onChange={(e) => setTechnicalField(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="problemSolved" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Problem Solved
          </label>
          <textarea
            id="problemSolved"
            rows={3}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="What specific problem does your invention solve?"
            value={problemSolved}
            onChange={(e) => setProblemSolved(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>
            Submit for Analysis
          </Button>
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
        </div>
      </form>
    </Card>
  );
}
