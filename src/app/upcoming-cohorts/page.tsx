import React from 'react';
import { db } from '@/lib/db';
import { ShieldCheck } from 'lucide-react';
import CohortsGrid from '@/components/cohorts-grid';

export const metadata = {
  title: "Upcoming Cohorts | Aurenza Academy",
  description: "Explore upcoming certification and technology program batches, schedules, and enrollment opportunities at Aurenza Academy."
};

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function UpcomingCohortsPage() {
  // Fetch databases straight from DB
  const courses = await db.course.findMany();
  const trainers = await db.trainer.findMany();
  const batches = await db.batch.findMany();
  const categories = await db.category.findMany();

  return (
    <div className="min-h-screen bg-white text-textPrimary py-16 px-4 sm:px-6 lg:px-8 font-sans relative">
      {/* Background neon blur */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-12 relative z-10">
        
        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <ShieldCheck className="w-3.5 h-3.5" /> Live Program Scheduler
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
            Upcoming <span className="text-gradient-purple-pink">Cohorts</span>
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
            Secure your seat in our upcoming certification and technology programs. Each cohort is strictly capped at 30 seats to ensure quality mentoring, 1-on-1 mock reviews, and corporate referrals.
          </p>
        </div>

        {/* Dynamic Cohorts Grid */}
        <CohortsGrid 
          batches={batches}
          courses={courses}
          trainers={trainers}
          categories={categories}
        />

      </div>
    </div>
  );
}
