import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";

export default function TrustPage() {
  return (
    <div>
      <Header
        title="Trust & Explainability"
        description="How we ensure transparent, reliable AI results"
      />
      <div className="p-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Explainable AI (XAI) Approach
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every score and recommendation in PatentIQ comes with a clear explanation of why it was generated.
              Our explainability layer breaks down the reasoning behind each novelty score, showing which
              prior art patents influenced the result and how each feature was evaluated.
            </p>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              XNS&#8482; Methodology
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The eXplainable Novelty Score (XNS&#8482;) combines semantic similarity analysis,
              CPC classification mapping, and feature-level comparison to produce a transparent,
              granular novelty assessment.
            </p>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Data Transparency
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              All patent data comes directly from the United States Patent and Trademark Office (USPTO).
              We clearly cite every patent referenced in our analysis, and you can drill down into
              the specific claims that overlap with your invention features.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
