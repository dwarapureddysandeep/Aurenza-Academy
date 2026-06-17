"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, HelpCircle, PhoneCall, CalendarDays } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Courses & Batches' | 'Certification & Exams' | 'Placement & Corporate';
}

const FAQS: FAQItem[] = [
  {
    question: "Are the courses live or recorded?",
    answer: "Our programs are primarily live instructor-led sessions with interactive learning, interactive Q&A blocks, and hands-on laboratory practice. All sessions are also recorded in 4K resolution and uploaded to your student portal for lifetime asynchronous review.",
    category: "Courses & Batches"
  },
  {
    question: "Will I receive a certificate after completion?",
    answer: "Yes. Upon completing the course modules and labs, learners receive an official Aurenza Academy Course Completion Certificate. We also provide direct roadmap guidance, vouchers, and mock reviews for relevant international industry certifications (like AWS, PMP, Scrum Alliance, AZ-104).",
    category: "Certification & Exams"
  },
  {
    question: "Do you provide certification exam support?",
    answer: "Yes, absolutely. We provide exam preparation quizzes, dumps, structured study materials, mock examinations, and expert mentorship reviews to maximize your certification success rates on your first attempt.",
    category: "Certification & Exams"
  },
  {
    question: "Are weekend and weekday batches available?",
    answer: "Yes. Flexible batch schedules are configured to suit both working professionals and full-time graduates. We offer intensive weekend cohorts (Saturdays & Sundays) as well as evening weekday sessions.",
    category: "Courses & Batches"
  },
  {
    question: "Do courses include hands-on projects?",
    answer: "Yes, every program is built around practical application. You will build, debug, and deploy multiple real-world portfolio projects, coding assignments, and case studies hosted on live sandbox environments.",
    category: "Courses & Batches"
  },
  {
    question: "Do you offer corporate training?",
    answer: "Yes, we partner with enterprises to deliver customized workforce upskilling solutions. We tailor course outlines to your business goals and tech stack, providing HR managers with automated skill assessments and attendance metrics logs.",
    category: "Placement & Corporate"
  },
  {
    question: "Is career support available?",
    answer: "Yes. Selected programs include comprehensive career support: professional resume rebuilding, LinkedIn profile optimization, salary negotiation techniques, mock interview prep, and direct referrals with our 500+ corporate hiring partners.",
    category: "Placement & Corporate"
  },
  {
    question: "How can I contact support?",
    answer: "You can reach out to our corporate advisors via email (info@aurenzaacademy.com), phone/WhatsApp hotline (+91 7013057827 / +44 7417 585004), or by submitting the contact forms available on our website.",
    category: "General"
  }
];

interface FAQAccordionProps {
  theme?: 'light' | 'dark';
}

export default function FAQAccordion({ theme = 'light' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Courses & Batches', 'Certification & Exams', 'Placement & Corporate'];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleBookConsultation = () => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('open-lead-modal', { detail: { source: 'FAQ Help Banner' } });
      window.dispatchEvent(event);
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  // Filter FAQs based on category and search input
  const filteredFAQs = FAQS.filter(faq => {
    const categoryMatch = selectedCategory === 'All' || faq.category === selectedCategory;
    const searchMatch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Compile JSON-LD structured schema for search engines
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const isDark = theme === 'dark';

  return (
    <div className="max-w-[900px] w-full mx-auto space-y-8 font-sans">
      
      {/* Dynamic SEO JSON-LD Injected Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setOpenIndex(null); // Close active accordion item on category change
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                isActive
                  ? isDark
                    ? 'bg-[#E85AD9] text-white shadow-glowPurple'
                    : 'bg-[#7A008C] text-white'
                  : isDark
                    ? 'bg-[#0E061A]/60 border border-white/[0.08] text-neutral-300 hover:bg-white/[0.05] hover:text-white'
                    : 'bg-white border border-[#ECECF4] text-[#5A5A6A] hover:bg-[#FAFAFC] hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* FAQ Search Box */}
      <div className="max-w-md mx-auto w-full">
        <div 
          className={`relative rounded-full border flex items-center px-4 py-3 transition duration-300 ${
            isDark
              ? 'border-white/[0.08] bg-[#0E061A]/80 focus-within:ring-2 focus-within:ring-[#E85AD9]/20'
              : 'border-[#ECECF4] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#7A008C]/10'
          }`}
        >
          <Search className={`w-4 h-4 mr-2.5 shrink-0 ${isDark ? 'text-neutral-400' : 'text-[#8A8A9A]'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your question (e.g. live, projects)..."
            className={`bg-transparent border-none text-xs focus:outline-none w-full font-medium ${
              isDark ? 'text-white placeholder-[#8A8A9A]' : 'text-[#1A1A1A] placeholder-[#8A8A9A]'
            }`}
          />
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, idx) => {
            // Find global index of this FAQ item to handle unique key and open state
            const globalIdx = FAQS.findIndex(item => item.question === faq.question);
            const isOpen = openIndex === globalIdx;
            
            return (
              <motion.div 
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`rounded-[16px] border overflow-hidden transition-all duration-300 ${
                  isDark
                    ? 'border-white/[0.08] bg-[#0E061A]/60 backdrop-blur-2xl shadow-2xl hover:border-white/[0.15]'
                    : 'border-[#ECECF4] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(globalIdx)}
                  className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span 
                    className={`flex items-center gap-3.5 text-xs sm:text-sm leading-snug transition-colors duration-300 ${
                      isOpen 
                        ? isDark 
                          ? 'text-[#E85AD9] font-extrabold' 
                          : 'text-[#7A008C] font-extrabold'
                        : isDark 
                          ? 'text-neutral-200 font-semibold' 
                          : 'text-[#1A1A1A] font-semibold'
                    }`}
                  >
                    <HelpCircle 
                      className={`w-4.5 h-4.5 shrink-0 transition-colors duration-300 ${
                        isOpen 
                          ? isDark 
                            ? 'text-[#E85AD9]' 
                            : 'text-[#7A008C]' 
                          : isDark 
                            ? 'text-neutral-400' 
                            : 'text-[#8A8A9A]'
                      }`} 
                    />
                    {faq.question}
                  </span>
                  
                  {/* Plus/Minus Rotatable Indicator Box */}
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isOpen 
                        ? isDark
                          ? 'border-[#E85AD9] bg-[#E85AD9]/10 text-[#E85AD9] rotate-180'
                          : 'border-[#7A008C] bg-[#7A008C]/5 text-[#7A008C] rotate-180'
                        : isDark
                          ? 'border-white/[0.1] text-neutral-400'
                          : 'border-[#ECECF4] text-[#5A5A6A]'
                    }`}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div 
                        className={`px-6 pb-6 pt-1 border-t text-xs sm:text-sm leading-relaxed font-semibold ${
                          isDark
                            ? 'border-white/[0.05] bg-[#05010B]/30 text-neutral-400'
                            : 'border-[#ECECF4]/60 bg-[#FAFAFC]/40 text-[#5A5A6A]'
                        }`}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className={`text-xs font-bold ${isDark ? 'text-neutral-400' : 'text-[#5A5A6A]'}`}>
              No matching questions found in FAQ archives.
            </p>
          </div>
        )}
      </div>

      {/* Still Need Help CTA Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`border rounded-[20px] p-6 sm:p-8 text-center space-y-5 max-w-2xl mx-auto ${
          isDark
            ? 'bg-[#0E061A]/80 border-white/[0.08] backdrop-blur-2xl shadow-2xl'
            : 'bg-white border-[#ECECF4] shadow-[0px_8px_24px_rgba(0,0,0,0.04)]'
        }`}
      >
        <div className="space-y-1">
          <h4 className={`text-sm sm:text-base font-extrabold heading ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
            Still have questions?
          </h4>
          <p className={`text-xs font-semibold ${isDark ? 'text-neutral-400' : 'text-[#5A5A6A]'}`}>
            Our technical learning advisors are active to resolve batch pricing details and scheduling options.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={scrollToContact}
            className={`w-full sm:w-auto px-5 py-3 rounded-btn border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              isDark
                ? 'border-white/[0.1] text-neutral-300 hover:bg-white/[0.05] hover:text-white'
                : 'border-[#ECECF4] text-[#5A5A6A] hover:bg-[#FAFAFC] hover:text-[#1A1A1A]'
            }`}
          >
            <PhoneCall className={`w-4 h-4 ${isDark ? 'text-neutral-300' : 'text-[#5A5A6A]'}`} /> Contact Us
          </button>
          
          <button
            onClick={handleBookConsultation}
            className={`w-full sm:w-auto px-6 py-3 rounded-btn text-xs font-black tracking-wider uppercase shadow-sm transition flex items-center justify-center gap-1.5 ${
              isDark
                ? 'bg-gradient-to-r from-[#7A008C] to-[#E85AD9] hover:from-[#E85AD9] hover:to-[#7A008C] text-white hover:shadow-glowPurple'
                : 'bg-gradient-purple-pink text-white hover:opacity-95'
            }`}
          >
            <CalendarDays className="w-4 h-4" /> Book Free Consultation
          </button>
        </div>
      </motion.div>

    </div>
  );
}
