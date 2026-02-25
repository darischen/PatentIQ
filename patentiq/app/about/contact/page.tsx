"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ContactPage() {
  return (
    <div>
      <Header
        title="Contact Support"
        description="Get in touch with the PatentIQ team"
      />
      <div className="p-8 max-w-2xl">
        <Card>
          <form className="space-y-4">
            <Input id="name" label="Name" placeholder="Your name" />
            <Input id="email" label="Email" type="email" placeholder="you@example.com" />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Subject
              </label>
              <select
                id="subject"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option>General Inquiry</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Account Issue</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Describe your question or issue..."
              />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
