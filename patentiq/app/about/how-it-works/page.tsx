import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";

const steps = [
  {
    number: 1,
    title: "Submit Your Invention",
    description: "Enter your invention idea through guided submission, document upload, or free-text input.",
  },
  {
    number: 2,
    title: "AI Feature Extraction",
    description: "Our AI extracts key technical features and concepts from your submission, which you can review and edit.",
  },
  {
    number: 3,
    title: "Patent Search & Retrieval",
    description: "The system generates optimized search queries and retrieves relevant patents from the USPTO database.",
  },
  {
    number: 4,
    title: "Novelty Analysis",
    description: "Each feature is compared against prior art to calculate the XNS™ (eXplainable Novelty Score).",
  },
  {
    number: 5,
    title: "Baseline Report",
    description: "Review your analysis summary including novelty score, key risks, closest prior art, and explainability insights.",
  },
  {
    number: 6,
    title: "Strategy Sandbox",
    description: "Interactively toggle features, explore what-if scenarios, and refine your patent strategy with live score updates.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <Header
        title="How It Works"
        description="Understanding the PatentIQ analysis pipeline"
      />
      <div className="p-8 max-w-4xl">
        <div className="space-y-4">
          {steps.map((step) => (
            <Card key={step.number} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900/30 dark:text-blue-400">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
