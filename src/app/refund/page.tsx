import React from 'react';
import Link from 'next/link';
import { BadgeHelp, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: "Refund Policy | Aurenza Academy",
  description: "Read Aurenza Academy's refund policy regarding course bookings, cancellations, and batch transfers.",
};

export default function RefundPolicyPage() {
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
            <BadgeHelp className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight heading">
            Refund <span className="text-gradient-purple-pink">Policy</span>
          </h1>
          <p className="text-xs text-textSecondary font-bold">
            Last Updated: June 26, 2026 &bull; Effective Immediately
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-xs sm:text-sm text-textSecondary leading-relaxed font-semibold">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">1. Overview</h2>
            <p>
              At Aurenza Academy, we aim to provide a transparent and fair refund policy. We want you to feel completely confident in your professional learning and development investment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">2. 100% Refund Window</h2>
            <p>
              We offer a **100% refund policy** before the official commencement of batch lectures:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>**Eligibility**: Refund requests must be submitted at least **3 days (72 hours)** prior to the scheduled date of your first cohort class session.</li>
              <li>**Processing**: Once approved, refunds are processed back to the original payment source within **5-7 business days**.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">3. Post-Commencement Policy</h2>
            <p>
              Once a cohort starts (after the first session has been delivered), refund requests are generally **not** eligible. However:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>**Batch Transfers**: If you cannot attend due to unforeseen circumstances, we allow you to transfer your enrollment to a future batch (within 6 months) at no extra cost.</li>
              <li>**Exceptional Cases**: Extenuating circumstances (e.g. medical emergencies) will be reviewed by our board on a case-by-case basis.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">4. Exam Vouchers</h2>
            <p>
              Please note that once an exam voucher (e.g., AWS, PMP, Prince2) has been issued/registered to your name, the cost of the voucher is strictly non-refundable and will be deducted from any potential refund calculations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">5. How to Request a Refund</h2>
            <p>
              To submit a cancellation or refund request, please email our billing department at:
            </p>
            
            <div className="bg-sectionBg border border-borderLight rounded-2xl p-5 space-y-3 max-w-md mt-4 text-xs font-bold text-textPrimary">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:info@aurenzaacademy.com" className="hover:text-primary transition font-bold">info@aurenzaacademy.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href="tel:+917013057827" className="hover:text-primary transition font-bold">+91 70130 57827</a>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
