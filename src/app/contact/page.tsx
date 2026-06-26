import React from 'react';
import ContactForm from '@/components/contact-form';
import { Phone, Mail, MapPin, ShieldCheck, Clock, MessageSquare, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import WhatsAppContactButton from '@/components/whatsapp-contact-button';
import FAQAccordion from '@/components/faq-accordion';
import CounselingButton from '@/components/counseling-button';
import { db } from '@/lib/db';

export const revalidate = 3600; // Cache on CDN for up to 1 hour, then regenerate in background (ISR)

export const metadata = {
  title: "Contact Us | Aurenza Academy",
  description: "Contact Aurenza Academy for course guidance, certification programs, corporate training, admissions support, and career counseling. Browse FAQs and connect with our advisors."
};

export default async function ContactPage() {
  let faqs: any[] = [];
  try {
    faqs = await db.faq.findMany({ orderBy: { order: 'asc' } });
  } catch (e) {
    console.error("Failed to load FAQs:", e);
  }
  return (
    <div className="min-h-screen bg-white text-textPrimary py-16 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background glowing bubbles */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full filter blur-[150px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-[#7A008C] uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <ShieldCheck className="w-3.5 h-3.5" /> 24/7 ENROLLMENT HOTLINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C182F] heading outfit">
            Contact <span className="text-gradient-purple-pink">Aurenza Academy</span>
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
            We're here to help you choose the right learning path.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start max-w-6xl mx-auto">
          
          {/* Details & Location Column */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Advisor Contacts Card */}
            <div className="bg-white border border-borderLight rounded-[24px] p-6 shadow-soft space-y-5">
              <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider outfit border-b border-borderLight pb-2">
                Academy Advisor Contacts
              </h4>
              
              <div className="space-y-4 text-xs sm:text-sm font-semibold">
                {/* Office Address */}
                <div className="flex gap-3 items-start">
                  <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-textPrimary heading">Academy HQ Office</h5>
                    <p className="text-xs text-textSecondary mt-1">Gajuwaka, Vishakapatanam, India</p>
                  </div>
                </div>

                {/* Hotlines */}
                <div className="flex gap-3 items-start">
                  <div className="p-2.5 rounded-xl bg-secondary/5 border border-secondary/10 text-secondary shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-textPrimary heading">Corporate Support Hotline</h5>
                    <Link href="tel:+917013057827" className="text-xs text-textSecondary hover:text-primary transition mt-1 block">
                      +91 7013057827
                    </Link>
                    <Link href="tel:+447417585004" className="text-xs text-textSecondary hover:text-primary transition mt-1 block">
                      +44 7417 585004
                    </Link>
                  </div>
                </div>

                {/* Support Email */}
                <div className="flex gap-3 items-start">
                  <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-textPrimary heading">Official Support Email</h5>
                    <Link href="mailto:info@aurenzaacademy.com" className="text-xs text-textSecondary hover:text-primary transition mt-1 block">
                      info@aurenzaacademy.com
                    </Link>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex gap-3 items-start">
                  <div className="p-2.5 rounded-xl bg-secondary/5 border border-secondary/10 text-secondary shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-textPrimary heading">Working Hours</h5>
                    <p className="text-xs text-textSecondary mt-1">
                      Monday - Saturday: 9:00 AM - 7:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <WhatsAppContactButton />
              </div>
            </div>

            {/* HQ Location & Directions Card */}
            <div className="bg-white border border-borderLight p-6 rounded-[24px] shadow-soft space-y-4">
              <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider outfit border-b border-borderLight pb-2">
                HQ Location & Directions
              </h4>
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-textPrimary text-xs sm:text-sm">Academy Headquarters</h5>
                  <p className="text-xs text-textSecondary mt-1">Gajuwaka, Vishakapatanam, India</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Andhra Pradesh, India</p>
                </div>
              </div>
              <a 
                href="https://maps.google.com/?q=Gajuwaka,%20Vishakapatanam,%20India"
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-primary hover:bg-primaryHover text-white text-xs font-bold transition shadow-soft uppercase tracking-wider"
              >
                Get Directions
              </a>
            </div>

            {/* Quick Support & Bookings Grid */}
            <div className="bg-white border border-borderLight p-6 rounded-[24px] shadow-soft space-y-4">
              <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider outfit border-b border-borderLight pb-2">
                Quick Support Options
              </h4>
              <p className="text-[11px] text-textSecondary font-semibold">
                Get instant support or schedule a learning callback slot immediately.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="tel:+917013057827"
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-borderLight hover:bg-sectionBg text-xs font-bold text-textPrimary hover:text-primary transition"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Support
                </Link>
                <Link
                  href="mailto:info@aurenzaacademy.com"
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-borderLight hover:bg-sectionBg text-xs font-bold text-textPrimary hover:text-primary transition"
                >
                  <Mail className="w-3.5 h-3.5" /> Email Us
                </Link>
                <a
                  href="https://wa.me/917013057827?text=Hello%20Aurenza%20Academy!%20I%20wish%20to%20enquire%20about%20learning%20options."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-borderLight hover:bg-sectionBg text-xs font-bold text-textPrimary hover:text-primary transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#128C7E]" /> WhatsApp Us
                </a>
                <CounselingButton
                  source="Contact Page Support Actions"
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-borderLight hover:bg-sectionBg text-xs font-bold text-textPrimary hover:text-primary transition"
                >
                  <CalendarDays className="w-3.5 h-3.5" /> Book Callback
                </CounselingButton>
              </div>
            </div>

          </div>

          {/* Form Column */}
          <div className="lg:col-span-6 bg-sectionBg border border-borderLight p-6 sm:p-8 rounded-[32px] shadow-premium self-stretch flex flex-col justify-center">
            <div className="space-y-3 mb-6">
              <h4 className="text-md sm:text-lg font-bold text-textPrimary outfit leading-none">Drop Us A Message</h4>
              <p className="text-xs text-textSecondary">Specify your career ambitions or questions, and our counseling team will email brochure catalogs.</p>
            </div>
            <ContactForm />
          </div>

        </div>

        {/* FAQ Section */}
        <div className="pt-16 border-t border-borderLight">
          <div className="text-center space-y-3 mb-12 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold text-[#7A008C] uppercase tracking-widest bg-[#7A008C]/5 px-3 py-1 rounded-full">
              Got Questions? We Have Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">
              Frequently Asked <span className="text-gradient-purple-pink">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
              Find answers to the most common questions about our courses, certifications, and training programs.
            </p>
          </div>
          <FAQAccordion theme="light" initialFaqs={faqs} />
        </div>

      </div>
    </div>
  );
}
