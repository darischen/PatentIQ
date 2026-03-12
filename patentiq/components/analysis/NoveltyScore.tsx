import Card, { CardTitle } from "@/components/ui/Card";

interface NoveltyScoreProps {
  score: number | null;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "High Novelty";
  if (score >= 40) return "Moderate Risk";
  return "High Risk";
}

export default function NoveltyScore({ score }: NoveltyScoreProps) {
  return (
    <Card>
      <CardTitle>XNS&#8482; Novelty Score</CardTitle>
      <div className="mt-4 flex flex-col items-center text-center">
        {score !== null ? (
          <>
            <p className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score}
            </p>
            <p className={`mt-1 text-sm font-medium ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </p>
            <div className="mt-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  score >= 70
                    ? "bg-green-500"
                    : score >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-5xl font-bold text-zinc-300 dark:text-zinc-600">--</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Score will appear after analysis
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
