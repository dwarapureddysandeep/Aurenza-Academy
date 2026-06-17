import React from 'react';
import { 
  BookOpen, 
  Users, 
  Code, 
  Briefcase, 
  Clock, 
  Award, 
  CreditCard, 
  MessageSquare, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import CounselingButton from '@/components/counseling-button';

export const metadata = {
  title: "Why Choose Aurenza Academy | Benefits of Learning With Us",
  description: "Explore the benefits of learning with Aurenza Academy. From industry-aligned curriculum and expert mentors to hands-on real-world labs and lifetime career guidance."
};

const benefits = [
  {
    id: "benefit-curriculum",
    title: "Industry-Relevant Curriculum",
    description: "Our syllabus is continuously audited and co-authored by active corporate recruitment managers to map precisely to current cloud, DevOps, software engineering, and AI hiring specifications.",
    icon: BookOpen,
    iconColor: "text-secondary",
    glowColor: "from-secondary/10 to-transparent"
  },
  {
    id: "benefit-mentors",
    title: "Expert Mentors & Trainers",
    description: "Learn from ex-FAANG, certified solution architects, and engineering managers who bring real-world enterprise production insights directly into live weekend cohorts.",
    icon: Users,
    iconColor: "text-primary",
    glowColor: "from-primary/10 to-transparent"
  },
  {
    id: "benefit-projects",
    title: "Hands-On Real-World Projects",
    description: "Graduate beyond generic sandboxes. Deploy live containerized architectures, engineer CI/CD orchestrations, and construct production-ready applications with modern toolchains.",
    icon: Code,
    iconColor: "text-blue-600",
    glowColor: "from-blue-600/10 to-transparent"
  },
  {
    id: "benefit-career",
    title: "Career Guidance & Interview Prep",
    description: "Receive full support from resume compilation and AI skill gap analysis to mock interviews, professional profile audits, and exclusive corporate placement referrals.",
    icon: Briefcase,
    iconColor: "text-emerald-600",
    glowColor: "from-emerald-600/10 to-transparent"
  },
  {
    id: "benefit-flexibility",
    title: "Flexible Learning Experience",
    description: "Balance your professional workload with interactive weekend sessions, flexible reschedule options, and permanent lifetime access to our HD recorded database libraries.",
    icon: Clock,
    iconColor: "text-amber-600",
    glowColor: "from-amber-600/10 to-transparent"
  },
  {
    id: "benefit-certification",
    title: "Certification & Skill Validation",
    description: "Secure Aurenza verified certificates alongside targeted, structured blueprints and vouchers to successfully pass globally recognized industry examinations (AWS, Azure, PMP).",
    icon: Award,
    iconColor: "text-rose-600",
    glowColor: "from-rose-600/10 to-transparent"
  },
  {
    id: "benefit-affordable",
    title: "Affordable Learning Programs",
    description: "Gain premium enterprise-grade instruction, interactive live modules, and 1-on-1 counseling support at a fraction of the cost of traditional, outdated bootcamps.",
    icon: CreditCard,
    iconColor: "text-violet-600",
    glowColor: "from-violet-600/10 to-transparent"
  },
  {
    id: "benefit-support",
    title: "Continuous Support & Community",
    description: "Never study alone. Tap into dedicated community channels, join private collaborative study groups, and participate in lifelong post-graduation mentorship networks.",
    icon: MessageSquare,
    iconColor: "text-cyan-600",
    glowColor: "from-cyan-600/10 to-transparent"
  }
];

export default function WhyUsPage() {
  return (
    <div className="min-h-screen bg-white text-textPrimary py-20 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Background glowing bubbles */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full filter blur-[150px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-16 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <ShieldCheck className="w-3.5 h-3.5" /> ELITE CAREER ACCELERATION
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-textPrimary heading tracking-tight leading-tight">
            Why Choose <span className="text-gradient-purple-pink">Aurenza Academy</span>?
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed max-w-2xl mx-auto font-medium">
            We bridge the gap between academic theory and enterprise reality. Join thousands of engineers, developers, and project leads who upskilled through our industry-aligned learning ecosystem.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={benefit.id}
                className="group relative bg-white border border-[#ececec] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(122,0,140,0.08)] hover:border-primary/20"
              >
                {/* Glow Background Effect */}
                <div className={`absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br ${benefit.glowColor} rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
                
                <div className="space-y-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center ${benefit.iconColor} group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-md font-extrabold text-textPrimary heading leading-snug">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-textSecondary leading-relaxed font-semibold">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Block */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 via-white to-secondary/5 border border-borderLight p-8 sm:p-12 rounded-[32px] flex flex-col items-center text-center gap-6 relative overflow-hidden shadow-soft backdrop-blur-3xl">
          <div className="absolute inset-0 map-grid opacity-[0.15] pointer-events-none"></div>
          <div className="space-y-2 relative z-10 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed font-semibold">
              Schedule a free 15-minute diagnostic callback with our senior industry mentors to analyze your technical skill gaps and identify your ideal certification path.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10 items-center justify-center">
            <Link
              href="/courses"
              className="px-8 py-3.5 rounded-full bg-white border border-borderLight text-textSecondary hover:text-textPrimary hover:bg-sectionBg font-bold text-xs transition shadow-soft flex items-center gap-2"
            >
              Explore Certifications <ArrowRight className="w-4 h-4" />
            </Link>
            
            <CounselingButton
              source="Why Us Page Bottom CTA"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-black text-xs uppercase tracking-wider transition shadow-soft hover:shadow-glowPurple hover:scale-[1.02] duration-300"
            >
              Request Free Consultation
            </CounselingButton>
          </div>
        </div>

      </div>
    </div>
  );
}
