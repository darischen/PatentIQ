import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";

export default function DocumentationPage() {
  return (
    <div>
      <Header
        title="Documentation"
        description="Technical documentation and guides"
      />
      <div className="p-8 max-w-4xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Learn how to create your first patent analysis and interpret the results.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Feature Extraction Guide</CardTitle>
            <CardDescription>
              How to prepare your invention description for optimal feature extraction.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Understanding XNS&#8482; Scores</CardTitle>
            <CardDescription>
              Detailed explanation of the eXplainable Novelty Score methodology.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Strategy Sandbox Guide</CardTitle>
            <CardDescription>
              How to use the interactive sandbox to optimize your patent strategy.
            </CardDescription>
          </Card>
        </div>
      </div>
    </div>
  );
}
