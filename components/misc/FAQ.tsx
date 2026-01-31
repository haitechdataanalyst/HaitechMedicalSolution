"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button onClick={onToggle} className="hover:text-primary flex w-full items-center justify-between py-5 text-left transition-colors" aria-expanded={isOpen}>
        <span className="pr-4 text-base font-medium text-gray-900">{item.question}</span>
        <ChevronDown className={cn("h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-300 ease-in-out", isOpen && "text-primary rotate-180")} />
      </button>
      <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <p className="pb-5 leading-relaxed text-gray-600">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ({ faqs, title = "Frequently Asked Questions", subtitle = "Find answers to common questions about our products and services." }: FAQProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} item={faq} isOpen={openId === faq.id} onToggle={() => handleToggle(faq.id)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
