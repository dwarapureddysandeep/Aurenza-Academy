"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ArrowRight, ArrowDownToLine } from 'lucide-react';
import toast from 'react-hot-toast';

interface CourseActionsWidgetProps {
  courseName: string;
  courseId: string;
  courseSlug: string;
}

export default function CourseActionsWidget({ courseName, courseId, courseSlug }: CourseActionsWidgetProps) {
  const [whatsappNumber, setWhatsappNumber] = useState('917013057827');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('aurenza_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.contactWhatsapp) {
          // clean number: remove +, space, dash
          const cleaned = parsed.contactWhatsapp.replace(/[+\s-]/g, '');
          setWhatsappNumber(cleaned);
        }
      } catch (e) {}
    }
  }, []);

  const handleJoinImmediately = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-lead-modal', {
        detail: {
          source: `Course Details Booking`,
          prefilledCourse: courseName,
          message: `Hi, I am interested in joining the ${courseName} program immediately. Please contact me with details.`
        }
      }));
    }
  };

  const handleContactUs = () => {
    const text = encodeURIComponent(`Hello Aurenza Academy! I would like to enquire about the ${courseName} certification program, upcoming cohorts, and class timetable.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const handleDownloadBrochure = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const toastId = toast.loading("Preparing brochure...");
    try {
      const res = await fetch(`/api/brochures/${courseSlug}`, { method: 'HEAD' });
      if (res.ok) {
        toast.success("Download started!", { id: toastId });
        window.open(`/api/brochures/${courseSlug}`, '_blank');
      } else {
        toast.error("Brochure Coming Soon", { id: toastId });
      }
    } catch (e) {
      toast.error("Brochure Coming Soon", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <button
        onClick={handleJoinImmediately}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-xs font-black text-white hover:opacity-95 transition flex items-center justify-center gap-2 hover:shadow-neonPurple uppercase tracking-wider text-center"
      >
        Join Immediately <ArrowRight className="w-4 h-4" />
      </button>

      <button
        onClick={handleContactUs}
        className="w-full py-4 rounded-xl bg-[#008556]/10 border border-[#008556]/20 hover:bg-[#008556]/20 text-xs font-bold text-[#008556] transition flex items-center justify-center gap-2 uppercase tracking-wider text-center"
      >
        <MessageSquare className="w-4 h-4 text-[#008556]" /> Contact Us
      </button>

      <button
        onClick={handleDownloadBrochure}
        disabled={isDownloading}
        className="w-full py-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:bg-slate-900 text-xs font-bold text-white transition flex items-center justify-center gap-2 uppercase tracking-wider text-center disabled:opacity-50"
      >
        <ArrowDownToLine className="w-4 h-4" /> Download Brochure
      </button>
    </div>
  );
}
