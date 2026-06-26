import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import FAQAccordion from '@/components/faq-accordion';
import { db } from '@/lib/db';

export const revalidate = 3600; // Cache for 1 hour

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | Aurenza Academy",
  description: "Get answers to frequently asked questions about Aurenza Academy's live cohorts, sandbox environments, exam prep vouchers, and direct placement support.",
};

export default async function FAQPage() {
  let faqs: any[] = [];
  try {
    faqs = await db.faq.findMany({ orderBy: { order: 'asc' } });
  } catch (e) {
    console.error("Failed to load FAQs:", e);
  }

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen py-16 md:py-24 text-textPrimary font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primaryHover transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        {/* Page Header */}
        <div className="space-y-4 border-b border-borderLight pb-8 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/10 mx-auto sm:mx-0">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight heading">
            Frequently Asked <span className="text-gradient-purple-pink">Questions</span>
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary font-semibold">
            Clear answers to help you navigate your professional certification pathway.
          </p>
        </div>

        {/* FAQ Accordion Component */}
        <div className="pt-4">
          <FAQAccordion theme="light" initialFaqs={faqs} />
        </div>

      </div>
    </div>
  );
}
