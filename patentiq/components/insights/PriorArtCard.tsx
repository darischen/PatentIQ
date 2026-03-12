import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

interface PriorArtCardProps {
  patentId: string;
  patentNumber: string;
  title: string;
  abstract: string;
  relevanceScore: number;
  riskLevel: "high" | "medium" | "low";
  overlappingFeatures: string[];
}

const riskVariant: Record<string, "danger" | "warning" | "success"> = {
  high: "danger",
  medium: "warning",
  low: "success",
};

export default function PriorArtCard({
  patentId,
  patentNumber,
  title,
  abstract,
  relevanceScore,
  riskLevel,
  overlappingFeatures,
}: PriorArtCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/insights/patents/${patentId}`}
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {patentNumber}
            </Link>
            <Badge variant={riskVariant[riskLevel]}>{riskLevel} risk</Badge>
          </div>
          <h4 className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{title}</h4>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {abstract}
          </p>
          {overlappingFeatures.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {overlappingFeatures.map((feature) => (
                <Badge key={feature} variant="default">{feature}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="ml-4 text-right">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {Math.round(relevanceScore * 100)}%
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">relevance</p>
        </div>
      </div>
    </Card>
  );
}
