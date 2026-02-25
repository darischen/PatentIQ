import Link from "next/link";
import Header from "@/components/layout/Header";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";

const aboutPages = [
  {
    title: "Product Overview",
    description: "Learn what PatentIQ does and how it can help you",
    href: "/about/product-overview",
  },
  {
    title: "How It Works",
    description: "Understand the AI-powered patent analysis pipeline",
    href: "/about/how-it-works",
  },
  {
    title: "Trust & Explainability",
    description: "How we ensure transparent, explainable AI results",
    href: "/about/trust",
  },
  {
    title: "Data Sources (USPTO)",
    description: "Learn about our patent data sources and coverage",
    href: "/about/data-sources",
  },
  {
    title: "Documentation",
    description: "Technical documentation and API reference",
    href: "/about/documentation",
  },
  {
    title: "Help & FAQs",
    description: "Frequently asked questions and help articles",
    href: "/about/help",
  },
  {
    title: "Contact Support",
    description: "Get in touch with our support team",
    href: "/about/contact",
  },
];

export default function AboutPage() {
  return (
    <div>
      <Header
        title="About / Platform Info"
        description="Learn about PatentIQ and how to use the platform"
      />
      <div className="p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aboutPages.map((page) => (
            <Link key={page.href} href={page.href}>
              <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                <CardTitle>{page.title}</CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
