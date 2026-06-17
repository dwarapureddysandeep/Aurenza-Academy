"use client";

import React, { useState } from 'react';
import { Search, Calendar, Clock, User, CheckCircle2, MessageSquare, ArrowRight, Video, GraduationCap, X } from 'lucide-react';
import CounselingButton from './counseling-button';

interface CohortsGridProps {
  batches: any[];
  courses: any[];
  trainers: any[];
  categories: any[];
}

export default function CohortsGrid({ batches, courses, trainers, categories }: CohortsGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');

  // Filter batches
  const filteredBatches = batches.filter((batch) => {
    const course = courses.find((c) => c.id === batch.courseId);
    if (!course) return false;

    // Search query match
    const matchesSearch = searchQuery.trim() === ''
      ? true
      : course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter match
    const matchesCategory = selectedCategory === 'All'
      ? true
      : course.categoryName.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        course.name.toLowerCase().includes(selectedCategory.toLowerCase());

    // Mode filter match (mocking mode based on batch or ID parity to make list dynamic)
    const mode = parseInt(batch.id.replace(/\D/g, '') || '0') % 2 === 0 ? 'Online' : 'Offline';
    const matchesMode = selectedMode === 'All'
      ? true
      : mode === selectedMode;

    return matchesSearch && matchesCategory && matchesMode;
  });

  const getTrainerDetails = (trainerId: string) => {
    const trainer = trainers.find((t) => t.id === trainerId);
    return {
      name: trainer ? trainer.name : 'Dr. Ramesh Kumar',
      specialty: trainer ? trainer.specialty : 'Ex-Amazon Senior Architect'
    };
  };

  const handleWhatsAppChat = (courseName: string) => {
    if (typeof window !== 'undefined') {
      const message = encodeURIComponent(`Hi Aurenza, I am interested in enrolling for the upcoming cohort of "${courseName}". Please share the course details and fee structure.`);
      window.open(`https://wa.me/917013057827?text=${message}`, '_blank');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ─── FILTERS PANEL ─── */}
      <div className="bg-sectionBg border border-borderLight rounded-3xl p-6 shadow-premium space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search box (Col span 5) */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A9A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course or certification..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-borderLight bg-white text-xs font-semibold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition shadow-soft"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-textSecondary hover:text-textPrimary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown (Col span 4) */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-borderLight bg-white text-xs font-semibold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition shadow-soft cursor-pointer text-textPrimary"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Selector (Col span 3) */}
          <div className="md:col-span-3">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-borderLight bg-white text-xs font-semibold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition shadow-soft cursor-pointer text-textPrimary"
            >
              <option value="All">All Formats (Online/Offline)</option>
              <option value="Online">Online Live Cohorts</option>
              <option value="Offline">Classroom (HQ Campus)</option>
            </select>
          </div>

        </div>
      </div>

      {/* ─── COHORTS RESULTS SECTION ─── */}
      {filteredBatches.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white border border-borderLight rounded-2xl overflow-hidden shadow-premium">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-borderLight bg-sectionBg/70 text-textPrimary font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-5 font-black">Certification Program</th>
                  <th className="p-5 font-black">Cohort Start Date</th>
                  <th className="p-5 font-black">Class Time Slots</th>
                  <th className="p-5 font-black">Corporate Mentor</th>
                  <th className="p-5 font-black">Format</th>
                  <th className="p-5 font-black text-center">Remaining Seats</th>
                  <th className="p-5 text-right font-black">Enrollment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight text-xs text-textSecondary font-semibold">
                {filteredBatches.map((batch) => {
                  const course = courses.find((c) => c.id === batch.courseId);
                  if (!course) return null;
                  const trainer = getTrainerDetails(batch.trainerId);
                  const isEven = parseInt(batch.id.replace(/\D/g, '') || '0') % 2 === 0;
                  const mode = isEven ? 'Online' : 'Offline';

                  return (
                    <tr key={batch.id} className="hover:bg-sectionBg/30 transition duration-200">
                      <td className="p-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0"></div>
                          <div>
                            <span className="text-[10px] text-textSecondary uppercase tracking-wider block font-bold leading-none mb-1">
                              {course.categoryName}
                            </span>
                            <span className="text-xs sm:text-sm font-extrabold text-textPrimary heading block">
                              {course.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-textPrimary">
                          <Calendar className="w-4 h-4 text-[#8A8A9A] shrink-0" />
                          <span>{batch.startDate}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-textPrimary">
                          <Clock className="w-4 h-4 text-[#8A8A9A] shrink-0" />
                          <span>{batch.timeSlot}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-textPrimary">
                          <User className="w-4 h-4 text-primary shrink-0" />
                          <div>
                            <span className="block font-bold">{trainer.name}</span>
                            <span className="text-[9px] text-textSecondary block font-bold">{trainer.specialty}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          mode === 'Online'
                            ? 'bg-successGreen/5 border-successGreen/20 text-[#008556]'
                            : 'bg-primary/5 border-primary/20 text-[#7A008C]'
                        }`}>
                          <Video className="w-3.5 h-3.5" />
                          {mode === 'Online' ? 'Online Live' : 'Classroom'}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-red-50 text-[#EF4444] border border-red-100 font-extrabold text-[10px] tracking-wider uppercase">
                          {batch.seatsLeft} Seats Left
                        </span>
                      </td>
                      <td className="p-5 text-right space-y-1.5">
                        <CounselingButton
                          source="Timetable Batches Grid"
                          prefilledCourse={course.name}
                          className="w-full max-w-[130px] px-3.5 py-2 rounded-lg bg-primary hover:bg-primaryHover text-[10px] text-white tracking-wider uppercase transition shadow-soft font-black inline-flex justify-center"
                        >
                          Enquire Now &rarr;
                        </CounselingButton>
                        <button
                          type="button"
                          onClick={() => handleWhatsAppChat(course.name)}
                          className="w-full max-w-[130px] px-3.5 py-2 rounded-lg border border-[#25D366]/20 bg-[#25D366]/5 hover:bg-[#25D366]/10 text-[#128C7E] text-[10px] font-bold tracking-wider uppercase transition inline-flex justify-center items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3 fill-current text-[#128C7E]" />
                          WhatsApp
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
            {filteredBatches.map((batch) => {
              const course = courses.find((c) => c.id === batch.courseId);
              if (!course) return null;
              const trainer = getTrainerDetails(batch.trainerId);
              const isEven = parseInt(batch.id.replace(/\D/g, '') || '0') % 2 === 0;
              const mode = isEven ? 'Online' : 'Offline';

              return (
                <div 
                  key={batch.id}
                  className="bg-white border border-borderLight rounded-2xl p-5 shadow-soft hover:shadow-premium transition flex flex-col justify-between gap-5 relative overflow-hidden"
                >
                  {/* Category & Badge overlay */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-textSecondary uppercase tracking-widest font-black block leading-none mb-1">
                        {course.categoryName}
                      </span>
                      <h4 className="text-sm font-extrabold text-textPrimary heading leading-snug">
                        {course.name}
                      </h4>
                    </div>
                    
                    <span className="absolute right-0 top-0 rounded-bl-xl bg-red-500 px-3 py-1 text-[9px] font-black text-white uppercase tracking-wider shadow-sm z-10">
                      {batch.seatsLeft} Left
                    </span>
                  </div>

                  {/* Batch params */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-textSecondary py-1 border-t border-b border-borderLight/80">
                    <div className="space-y-1">
                      <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider leading-none">Start Date</span>
                      <div className="flex items-center gap-1.5 text-textPrimary">
                        <Calendar className="w-3.5 h-3.5 text-[#8A8A9A]" />
                        <span>{batch.startDate}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider leading-none">Format</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border ${
                        mode === 'Online'
                          ? 'bg-successGreen/5 border-successGreen/25 text-[#008556]'
                          : 'bg-primary/5 border-primary/25 text-[#7A008C]'
                      }`}>
                        {mode === 'Online' ? 'Online Live' : 'Classroom'}
                      </span>
                    </div>

                    <div className="col-span-2 space-y-1">
                      <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider leading-none">Class Schedule</span>
                      <div className="flex items-center gap-1.5 text-textPrimary">
                        <Clock className="w-3.5 h-3.5 text-[#8A8A9A]" />
                        <span>{batch.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trainer & Actions */}
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black uppercase text-[10px]">
                        RK
                      </div>
                      <div>
                        <span className="block font-bold text-textPrimary text-xs">{trainer.name}</span>
                        <span className="text-[9px] text-textSecondary block leading-none mt-0.5 font-bold">{trainer.specialty}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <CounselingButton
                        source="Timetable Batches Cards"
                        prefilledCourse={course.name}
                        className="py-3 rounded-xl bg-primary hover:bg-primaryHover text-[10px] text-white tracking-wider uppercase transition shadow-soft font-black text-center flex justify-center"
                      >
                        Enquire Now
                      </CounselingButton>
                      <button
                        type="button"
                        onClick={() => handleWhatsAppChat(course.name)}
                        className="py-3 rounded-xl border border-[#25D366]/20 bg-[#25D366]/5 hover:bg-[#25D366]/10 text-[#128C7E] text-[10px] font-bold tracking-wider uppercase transition flex justify-center items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current text-[#128C7E]" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white border border-borderLight rounded-3xl p-12 text-center max-w-lg mx-auto shadow-premium animate-fade-up">
          <GraduationCap className="w-12 h-12 text-textSecondary mx-auto mb-4 animate-bounce" />
          <h4 className="text-md font-extrabold heading text-textPrimary">No Cohorts Match Your Search</h4>
          <p className="text-xs text-textSecondary leading-relaxed mt-2 max-w-xs mx-auto">
            Try adjusting your category or technology parameters, or reach out to our advisor team for custom schedules.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedMode('All'); setSearchQuery(''); }}
            className="mt-4 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primaryHover transition"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
