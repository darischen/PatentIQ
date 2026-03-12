import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface ReportCardProps {
  id: string;
  analysisTitle: string;
  format: "pdf" | "visual" | "data";
  generatedAt: string;
  downloadUrl: string;
}

const formatLabels: Record<string, string> = {
  pdf: "PDF Report",
  visual: "Visual Summary",
  data: "Data Snapshot",
};

const formatVariants: Record<string, "info" | "success" | "default"> = {
  pdf: "info",
  visual: "success",
  data: "default",
};

export default function ReportCard({
  id,
  analysisTitle,
  format,
  generatedAt,
  downloadUrl,
}: ReportCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
              {analysisTitle}
            </h4>
            <Badge variant={formatVariants[format]}>
              {formatLabels[format]}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Generated: {new Date(generatedAt).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" size="sm">
          Download
        </Button>
      </div>
    </Card>
  );
}
