import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: "Terms & Conditions | Aurenza Academy",
  description: "Read Aurenza Academy's terms of service and conditions governing cohort enrollments, payments, and platform usage.",
};

export default function TermsConditionsPage() {
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
        <div className="space-y-4 border-b border-borderLight pb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/10">
            <FileText className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight heading">
            Terms & <span className="text-gradient-purple-pink">Conditions</span>
          </h1>
          <p className="text-xs text-textSecondary font-bold">
            Last Updated: June 26, 2026 &bull; Effective Immediately
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-xs sm:text-sm text-textSecondary leading-relaxed font-semibold">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">1. Introduction</h2>
            <p>
              Welcome to Aurenza Academy ("we", "our", "us"). These Terms & Conditions ("Terms") govern your access to and use of our website, learning management systems (LMS), sandbox environments, and live cohort counseling or enrollment programs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">2. Admissions & Enrollments</h2>
            <p>
              By enrolling in any of our core programs or flagship certifications, you agree that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>**Eligibility**: You meet the target audience profiles and recommended prerequisites for the selected program.</li>
              <li>**Accuracy**: All registration, contact, and billing details provided are accurate and current.</li>
              <li>**Cohort Allocations**: Batch schedules and lecture links are allocated dynamically and should not be shared with external users.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">3. Payments & Fees</h2>
            <p>
              All fees are billed in advance of cohort commencements. We offer flexible payment structures (EMI installment schemes) and secure checkout pipes. Exam vouchers and certified mock review fees are covered as specified in the individual course guide syllabus.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">4. Code of Conduct</h2>
            <p>
              Learners are expected to maintain professional and respectful behavior during live weekend interactive cohorts, counseling dry-runs, and cohort Slack channels. We reserve the right to suspend platform access for any candidate violating standards of academic integrity or professional decorum.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">5. Intellectual Property</h2>
            <p>
              All course guides, syllabus materials, pre-seeded sandbox lab scripts, lecture logs, and assessment blueprints are the exclusive intellectual property of Aurenza Academy and our accredited partners. Redistribution or unauthorized publication is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">6. Contacts & Compliance</h2>
            <p>
              For queries or concerns regarding these Terms, please reach out to our legal officer:
            </p>
            
            <div className="bg-sectionBg border border-borderLight rounded-2xl p-5 space-y-3 max-w-md mt-4 text-xs font-bold text-textPrimary">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Gajuwaka, Vishakapatanam, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:info@aurenzaacademy.com" className="hover:text-primary transition">info@aurenzaacademy.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href="tel:+917013057827" className="hover:text-primary transition">+91 70130 57827</a>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
