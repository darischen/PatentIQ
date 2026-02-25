import Header from "@/components/layout/Header";
import Card, { CardTitle } from "@/components/ui/Card";
import ClaimMapping from "@/components/insights/ClaimMapping";

interface ClaimsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClaimsPage({ params }: ClaimsPageProps) {
  const { id } = await params;

  return (
    <div>
      <Header
        title="Feature-to-Claim Mapping"
        description={`Patent ID: ${id} - See how your invention features map to this patent's claims`}
      />

      <div className="p-8">
        <ClaimMapping patentId={id} />
      </div>
    </div>
  );
}
