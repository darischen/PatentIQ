import Card, { CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Risk {
  featureId: string;
  featureName: string;
  riskLevel: "high" | "medium" | "low";
  description: string;
  mitigationSuggestion: string;
}

interface RiskOverviewProps {
  risks: Risk[];
}

const riskVariant: Record<string, "danger" | "warning" | "success"> = {
  high: "danger",
  medium: "warning",
  low: "success",
};

export default function RiskOverview({ risks }: RiskOverviewProps) {
  return (
    <Card>
      <CardTitle>Key Risks & Overlap</CardTitle>

      {risks.length === 0 ? (
        <div className="mt-4 flex flex-col items-center py-8 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Risk assessment will appear after analysis completes.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {risks.map((risk) => (
            <div
              key={risk.featureId}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                  {risk.featureName}
                </h4>
                <Badge variant={riskVariant[risk.riskLevel]}>
                  {risk.riskLevel} risk
                </Badge>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {risk.description}
              </p>
              {risk.mitigationSuggestion && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  Suggestion: {risk.mitigationSuggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
