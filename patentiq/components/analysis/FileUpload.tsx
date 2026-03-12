"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);

    try {
      // TODO: Upload file and create analysis
      const formData = new FormData();
      formData.append("file", file);
      formData.append("inputMethod", "document");

      // Placeholder - will integrate with API
      console.log("Uploading file:", file.name);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        Upload Technical Document
      </h2>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
            : "border-zinc-300 dark:border-zinc-700"
        }`}
      >
        <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>

        {file ? (
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={() => setFile(null)}
              className="mt-2 text-xs text-red-500 hover:text-red-700"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Drag & drop your document here, or{" "}
              <button
                onClick={() => inputRef.current?.click()}
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                browse files
              </button>
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Supported: PDF, DOCX, TXT (max 10MB)
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {file && (
        <div className="mt-6 flex gap-3">
          <Button onClick={handleSubmit} loading={loading}>
            Upload & Analyze
          </Button>
          <Button variant="outline" onClick={() => setFile(null)}>
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}
