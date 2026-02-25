"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import IdeaInputForm from "@/components/analysis/IdeaInputForm";
import FileUpload from "@/components/analysis/FileUpload";

type InputMethod = "guided" | "document" | null;

export default function NewAnalysisPage() {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>(null);

  return (
    <div>
      <Header
        title="New Analysis"
        description="Choose how you want to submit your invention for analysis"
      />

      <div className="p-8 max-w-4xl">
        {!selectedMethod ? (
          <div>
            <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Choose Input Method
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button onClick={() => setSelectedMethod("guided")} className="text-left">
                <Card className="h-full transition-shadow hover:shadow-md hover:border-blue-300 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle>Guided Idea Submission</CardTitle>
                      <CardDescription>
                        Walk through a step-by-step form to describe your invention with structured prompts
                      </CardDescription>
                    </div>
                  </div>
                </Card>
              </button>

              <button onClick={() => setSelectedMethod("document")} className="text-left">
                <Card className="h-full transition-shadow hover:shadow-md hover:border-blue-300 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle>Upload Technical Document</CardTitle>
                      <CardDescription>
                        Upload a PDF, DOCX, or text file containing your invention description or provisional draft
                      </CardDescription>
                    </div>
                  </div>
                </Card>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedMethod(null)}
              className="mb-6 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to input method selection
            </button>

            {selectedMethod === "guided" && <IdeaInputForm />}
            {selectedMethod === "document" && <FileUpload />}
          </div>
        )}
      </div>
    </div>
  );
}
