import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";

export default function DataSourcesPage() {
  return (
    <div>
      <Header
        title="Data Sources"
        description="Patent data sources and coverage"
      />
      <div className="p-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              USPTO (United States Patent and Trademark Office)
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Our primary data source is the USPTO patent database, which includes both granted
              patents and pending patent applications.
            </p>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>- USPTO Patent Full-Text Database (granted patents)</li>
              <li>- USPTO Patent Application Database (pending applications)</li>
              <li>- CPC (Cooperative Patent Classification) codes</li>
              <li>- PatentsView API for structured data access</li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Future Data Sources
            </h2>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>- WIPO (World Intellectual Property Organization)</li>
              <li>- EPO (European Patent Office)</li>
              <li>- International patent databases</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
