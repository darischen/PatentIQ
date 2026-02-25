import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";

export default function ProductOverviewPage() {
  return (
    <div>
      <Header
        title="Product Overview"
        description="AI Patent Intelligence Platform"
      />
      <div className="p-8 max-w-4xl">
        <Card>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            What is PatentIQ?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            PatentIQ is an AI-powered patent intelligence platform that helps inventors, patent attorneys,
            and R&D teams evaluate the novelty of their inventions before filing patent applications.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-6 mb-3">
            Key Features
          </h3>
          <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span><strong>AI Feature Extraction</strong> - Automatically identifies key technical features from your invention description</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span><strong>Patent Search & Comparison</strong> - Searches USPTO database to find relevant prior art</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span><strong>Novelty Scoring (XNS&#8482;)</strong> - Provides an explainable novelty score for your invention</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span><strong>Strategy Sandbox</strong> - Interactive what-if exploration to refine your patent strategy</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">5.</span>
              <span><strong>Explainability</strong> - Transparent explanations for every score and recommendation</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
