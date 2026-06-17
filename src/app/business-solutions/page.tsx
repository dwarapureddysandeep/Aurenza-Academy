import React from 'react';
import CorporateForm from '@/components/corporate-form';
import { 
  ShieldCheck, Check, Building2, Server, HelpCircle, 
  Layers, Cpu, Award, Users, Compass, Calendar, LineChart, 
  BarChart3, MessageSquare, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "Business Solutions | Corporate Training | Aurenza Academy",
  description: "Customized corporate training, workforce upskilling, certification programs, and enterprise learning solutions for modern organizations."
};

export default function BusinessSolutionsPage() {
  const services = [
    { title: "Corporate Training Programs", desc: "Customized technology courses mapped to your target tech stack and business priorities.", icon: <Server className="w-5 h-5 text-primary" /> },
    { title: "Certification Bootcamps", desc: "Intensive exam-preparation tracks for AWS, Azure, Agile, and PMP certs with mock exams.", icon: <Award className="w-5 h-5 text-secondary" /> },
    { title: "Agile & DevOps Transformation", desc: "Equip software delivery teams with advanced CI/CD, container architectures, and SAFe frameworks.", icon: <Layers className="w-5 h-5 text-primary" /> },
    { title: "AI & Data Science Upskilling", desc: "From data analytics to LLM fine-tuning and machine learning pipeline optimization.", icon: <Cpu className="w-5 h-5 text-secondary" /> }
  ];

  const benefits = [
    { title: "Customized Learning Paths", desc: "Curriculums mapped precisely to team capabilities and business goals.", icon: <Compass className="w-6 h-6 text-primary" /> },
    { title: "Expert Trainers", desc: "Learn from active industry practitioners and certified enterprise architects.", icon: <Users className="w-6 h-6 text-secondary" /> },
    { title: "Flexible Delivery Models", desc: "Online live cohorts, custom hybrid setups, or intensive weekend bootcamps.", icon: <Calendar className="w-6 h-6 text-primary" /> },
    { title: "Skill Assessments", desc: "Measure upskilling progression with structured entry and exit evaluations.", icon: <LineChart className="w-6 h-6 text-secondary" /> },
    { title: "Certification Support", desc: "Study materials, exam blueprints, and simulator passes to maximize success.", icon: <Award className="w-6 h-6 text-primary" /> },
    { title: "Post-Training Analytics", desc: "Detailed employee progression logs, attendance indices, and skills reports.", icon: <BarChart3 className="w-6 h-6 text-secondary" /> }
  ];

  const industries = [
    "IT Services & Consulting",
    "Banking & Finance (BFSI)",
    "Healthcare & Life Sciences",
    "Telecom & Networks",
    "Retail & E-commerce",
    "Manufacturing & Logistics",
    "High-Growth Startups"
  ];

  return (
    <div className="min-h-screen bg-white text-textPrimary py-16 px-4 sm:px-6 lg:px-8 font-sans relative">
      {/* Neon background blurs */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-20 relative z-10">
        
        {/* 1. HERO SECTION */}
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Building2 className="w-3.5 h-3.5" /> B2B ENTERPRISE TALENT SOLUTIONS
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-textPrimary heading leading-tight tracking-tight">
              Business Solutions for <span className="text-gradient-purple-pink">Enterprise Teams</span>
            </h1>
            <p className="text-sm sm:text-base text-textSecondary leading-relaxed max-w-2xl font-medium">
              Upskill your workforce with customized training programs, certification tracks, and technology transformation initiatives designed to achieve tangible business outcomes.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href="#enquiry-form"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary hover:bg-primaryHover text-xs font-black tracking-wider uppercase text-white hover:shadow-glowPurple transition text-center"
              >
                Request Proposal &rarr;
              </a>
              <a
                href="https://wa.me/917013057827?text=Hi%20Aurenza,%20we%20want%20to%20inquire%20about%20corporate%20training%20solutions%20for%20our%20team."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-borderLight hover:bg-[#FAFAFC] text-xs font-extrabold tracking-wider uppercase text-textPrimary transition text-center flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 fill-current text-[#128C7E]" />
                WhatsApp Business Enquiry
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 bg-sectionBg border border-borderLight p-6 sm:p-8 rounded-[32px] shadow-premium">
            <div className="space-y-4 mb-6">
              <h4 className="text-md sm:text-lg font-extrabold text-textPrimary heading leading-none">Schedule a B2B Consultation</h4>
              <p className="text-xs text-textSecondary">Input your corporate upskilling parameters and our training coordinators will reach out.</p>
            </div>
            <div id="enquiry-form">
              <CorporateForm />
            </div>
          </div>
        </div>

        {/* 2. SERVICES SECTION */}
        <div className="space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Core Services</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">Enterprise-Grade Upskilling Services</h2>
            <p className="text-xs sm:text-sm text-textSecondary">Structured talent progression models for technology corporations and agile delivery groups.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((serv, idx) => (
              <div key={idx} className="bg-white border border-borderLight rounded-2xl p-6 shadow-soft hover:shadow-premium transition flex flex-col justify-between h-full hover:-translate-y-1 duration-200">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                    {serv.icon}
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-textPrimary heading">{serv.title}</h4>
                  <p className="text-xs text-textSecondary leading-relaxed">{serv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. WHY CHOOSE AURENZA */}
        <div className="bg-sectionBg border border-borderLight rounded-[32px] p-8 sm:p-12 space-y-12 shadow-premium">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A008C]">Why Aurenza for B2B</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">Why Corporations Partner With Us</h2>
            <p className="text-xs sm:text-sm text-textSecondary">High-caliber learning methods that translate into workforce capabilities and certifications success.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-white border border-borderLight shadow-sm flex items-center justify-center shrink-0">
                  {benefit.icon}
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs sm:text-sm font-extrabold text-textPrimary heading">{benefit.title}</h5>
                  <p className="text-xs text-textSecondary leading-relaxed font-semibold">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. INDUSTRIES SERVED */}
        <div className="space-y-8 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Global Reach</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">Industries We Upskill</h2>
            <p className="text-xs sm:text-sm text-textSecondary">Tailored upskilling tracks spanning multiple sectors and compliance regulations.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {industries.map((ind, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 bg-[#FAFAFC] border border-borderLight rounded-full text-xs font-bold text-textPrimary shadow-soft flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5 text-primary" />
                {ind}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
