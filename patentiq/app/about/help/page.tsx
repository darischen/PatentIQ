import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";

const faqs = [
  {
    question: "What types of inventions can I analyze?",
    answer: "PatentIQ supports analysis of any type of invention that could potentially be patented. You can submit text descriptions, technical documents, or use our guided submission form.",
  },
  {
    question: "How accurate is the novelty score?",
    answer: "The XNS™ score is designed to provide a reliable initial assessment. However, it should be used as a starting point alongside professional patent counsel, not as a replacement for a formal patentability search.",
  },
  {
    question: "What is the Strategy Sandbox?",
    answer: "The Strategy Sandbox lets you interactively toggle features of your invention on/off and see how the novelty score changes in real-time. This helps you understand which features are most novel and develop a stronger patent strategy.",
  },
  {
    question: "Which patent databases do you search?",
    answer: "Currently, we search the USPTO (United States Patent and Trademark Office) database, including both granted patents and pending applications. Support for WIPO and EPO is planned for future releases.",
  },
  {
    question: "Can I export my analysis results?",
    answer: "Yes, you can export analysis results as PDF reports, visual summaries, or raw data snapshots from the Downloads section.",
  },
];

export default function HelpPage() {
  return (
    <div>
      <Header
        title="Help & FAQs"
        description="Frequently asked questions and help resources"
      />
      <div className="p-8 max-w-4xl">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {faq.answer}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
