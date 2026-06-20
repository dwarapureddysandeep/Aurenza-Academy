import React from 'react';
import { db } from '@/lib/db';
import Testimonials from '@/components/testimonials';

export const revalidate = 60; // Revalidate cache every 60 seconds

export const metadata = {
  title: "Success Stories & Student Reviews | Aurenza Academy",
  description: "Read real student reviews, career transformations, video testimonials, and professional placements from Aurenza Academy graduates."
};

export default async function SuccessStoriesPage() {
  // Fetch dynamic testimonials from database
  let testimonials: any[] = [];
  try {
    testimonials = await db.testimonial.findMany();
  } catch (e) {
    console.error("Failed to load testimonials:", e);
  }

  return (
    <div className="w-full bg-white text-textPrimary overflow-x-hidden font-sans">
      <Testimonials initialTestimonials={testimonials} isHomepage={false} />
    </div>
  );
}
