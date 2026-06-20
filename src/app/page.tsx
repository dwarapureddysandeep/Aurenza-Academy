import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Code, Laptop, Users, Target, Phone, Mail, MapPin, ChevronRight, Sparkles, GraduationCap } from 'lucide-react';

import { db } from '@/lib/db';
import CourseFilterGrid from '@/components/course-filter-grid';
import RoadmapExplorer from '@/components/roadmap-explorer';

import CounselingButton from '@/components/counseling-button';
import HeroSection from '@/components/hero-section';
import PopularCategories from '@/components/popular-categories';
import TrendingCourses from '@/components/trending-courses';
import Testimonials from '@/components/testimonials';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch dynamic data straight from the database
  let courses: any[] = [];
  let testimonials: any[] = [];
  let batches: any[] = [];
  let webinars: any[] = [];
  let homepageContent: any[] = [];
  let certificationCategories: any[] = [];
  let certificationCourses: any[] = [];

  try {
    courses = await db.course.findMany();
    testimonials = await db.testimonial.findMany();
    batches = await db.batch.findMany();
    webinars = await db.webinar.findMany();
    homepageContent = await db.homepageContent.findMany();
    certificationCategories = await db.certificationCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });
    certificationCourses = await db.certificationCourse.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: { category: true }
    });
  } catch (e) {
    console.error("Failed to load homepage data:", e);
  }

  return (
    <div className="w-full bg-white text-textPrimary overflow-x-hidden font-sans">
      
      {/* ==========================================
         SECTION 1: HERO SECTION (White Background - Duplicating First Screenshot)
         ========================================== */}
      <HeroSection homepageContent={homepageContent} />

      {/* ==========================================
         NEW SECTION: POPULAR CATEGORIES (Course Discovery Section)
         ========================================== */}
      <PopularCategories />

      {/* ==========================================
         NEW SECTION: TRENDING COURSES (Primary Conversion Section)
         ========================================== */}
      <TrendingCourses initialCourses={courses as any} />

      {/* ==========================================
         SECTION 2: FEATURED CERTIFICATIONS (Off-White Background - Duplicating Second Screenshot)
         ========================================== */}
      <section className="py-24 bg-sectionBg border-t border-borderLight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-14">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Prestige Programs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
              Explore Our <span className="text-gradient-purple-pink">Flagship Certifications</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-lg mx-auto">
              Curriculums mapped to international standards, live interactive classes, and corporate review sessions.
            </p>
          </div>

          {/* Dynamic filtering courses catalog */}
          {/* Dynamic filtering courses catalog limited to 6 on homepage */}
          <CourseFilterGrid 
            initialCourses={certificationCourses} 
            initialCategories={certificationCategories} 
            limit={6} 
            isHomepage={true} 
          />

        </div>
      </section>

      {/* ==========================================
         SECTION 3: CAREER ROADMAP EXPLORER (White Background)
         ========================================== */}
      <section className="py-24 border-t border-borderLight bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-2 mb-14">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Interactive Navigator</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
              Career <span className="text-gradient-purple-pink">Roadmap Explorer</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-lg mx-auto">
              Choose your current background status and trace your high-paying engineering roadmap step-by-step.
            </p>
          </div>

          <RoadmapExplorer />

        </div>
      </section>

      {/* ==========================================
         SECTION 4: TESTIMONIALS (Social Proof & Trust Section)
         ========================================== */}
      <Testimonials initialTestimonials={testimonials} limit={2} isHomepage={true} />

      {/* ==========================================
         SECTION 5: UPCOMING WEBINARS (Off-White Background)
         ========================================== */}
      <section className="py-24 bg-sectionBg border-t border-borderLight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-14">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Learning Events</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
              Upcoming Live <span className="text-gradient-purple-pink">Career Webinars</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-lg mx-auto">
              Join free interactive sessions led by active technology directors. Get live career advice and QA sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {webinars.map((web: any) => (
              <div 
                key={web.id}
                className="premium-glass-card p-6 space-y-4 border-l-4 border-l-primary relative overflow-hidden hover:-translate-y-1 transition duration-300"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{web.status} Masterclass</span>
                  <h4 className="text-md sm:text-lg font-extrabold text-textPrimary heading leading-snug">{web.title}</h4>
                  <p className="text-xs text-textSecondary mt-1 leading-relaxed">{web.description}</p>
                </div>

                <div className="pt-3 border-t border-borderLight grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-textSecondary">
                  <div>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider">Corporate Speaker</span>
                    <strong className="text-textPrimary mt-0.5 block">{web.speaker}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider">Date & Time</span>
                    <strong className="text-textPrimary mt-0.5 block">{web.date} ({web.time})</strong>
                  </div>
                </div>

                <CounselingButton
                  source="Webinars Registration Grid"
                  prefilledCourse={`Webinar: ${web.title}`}
                  className="w-full py-3 rounded-lg bg-sectionBg border border-borderLight hover:border-primary hover:bg-primary/5 text-xs font-bold text-textPrimary hover:text-primary transition text-center"
                >
                  Register For Free Session
                </CounselingButton>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
         SECTION 6: CONTACT CALL-TO-ACTION (Compact & Conversion Focused)
         ========================================== */}
      <section className="py-16 bg-white border-t border-borderLight relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-[#7A008C] uppercase tracking-widest bg-[#7A008C]/5 px-3 py-1 rounded-full">
              Get Expert Guidance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading tracking-tight">
              Need Help Choosing the <span className="text-gradient-purple-pink">Right Course?</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-md mx-auto leading-relaxed">
              Talk with our learning advisors and get personalized guidance for your career goals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 rounded-btn border border-borderLight text-[#5A5A6A] text-xs font-bold hover:bg-[#FAFAFC] hover:text-[#1A1A1A] transition flex items-center justify-center gap-1.5"
            >
              Contact Us
            </Link>
            
            <a
              href="https://wa.me/917013057827?text=Hello%20Aurenza%20Academy!%20I%20would%20like%20to%20enquire%20about%20your%20upcoming%20live%20cohorts%2C%20placement%20referrals%2C%20and%20AI%20Career%20Counseling%20packages."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-btn bg-[#25D366]/5 border border-[#25D366]/20 text-[#128C7E] text-xs font-bold hover:bg-[#25D366]/10 transition flex items-center justify-center gap-1.5"
            >
              WhatsApp Us
            </a>

            <CounselingButton
              source="Homepage Contact CTA"
              className="w-full sm:w-auto px-6 py-3 rounded-btn bg-gradient-to-r from-[#7A008C] to-[#E85AD9] hover:from-[#E85AD9] hover:to-[#7A008C] text-white text-xs font-black uppercase tracking-wider hover:shadow-glowPurple hover:scale-[1.02] transition duration-300"
            >
              Book Free Counseling
            </CounselingButton>
          </div>
        </div>
      </section>

    </div>
  );
}
