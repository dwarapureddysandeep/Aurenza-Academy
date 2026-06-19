"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  saveCourseAction,
  deleteCourseAction,
  saveTrainerAction,
  deleteTrainerAction,
  saveBatchAction,
  deleteBatchAction,
  updatePaymentStatusAction,
  saveTestimonialAction,
  deleteTestimonialAction,
  saveBlogAction,
  deleteBlogAction,
  saveCategoryAction,
  deleteCategoryAction,
  updateLeadStatusAction,
  generateCertificateAction,
  saveNotificationSettingsAction,
  saveFaqAction,
  deleteFaqAction,
  saveHomepageContentBulkAction,
  updateOneOnOneRequestStatusAction
} from '@/lib/actions';
import { parseBatchData } from '@/lib/utils';
import {
  Layers, Briefcase, PlusCircle, Award, Phone, Mail, User, Clock,
  Calendar, Sparkles, Home, BookOpen, Folder, Users, CreditCard,
  MessageSquare, FileText, Settings, Trash2, Edit, Check, X,
  Search, TrendingUp, RefreshCw, BarChart2, ShieldAlert, CheckCircle, HelpCircle, ChevronRight,
  Bell, Video, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from './loading-spinner';

interface AdminCrmWidgetProps {
  initialLeads: any[];
  initialCorporateLeads: any[];
  courses: any[];
  batches: any[];
  students: any[];
  trainers: any[];
  categories: any[];
  payments: any[];
  certificates: any[];
  testimonials: any[];
  blogs: any[];
  notificationSettings: any[];
  notificationLogs: any[];
  faqs?: any[];
  homepageContent?: any[];
  oneOnOneRequests?: any[];
  contactRequests?: any[];
}

interface FileUploadWidgetProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  bucket: 'courses' | 'trainers' | 'testimonials' | 'brochures' | 'website-assets';
  accept?: string;
}

function FileUploadWidget({ label, value, onChange, bucket, accept = "image/*" }: FileUploadWidgetProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onChange(data.url);
        toast.success("Upload successful!", { id: toastId });
      } else {
        toast.error(data.error || "Upload failed", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-xs font-semibold">
      <label className="font-bold text-textSecondary uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="File URL (browse file or paste link)"
          className="glass-input flex-1"
        />
        <label className="px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primaryHover border border-primary/20 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Browse"}
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}

export default function AdminCrmWidget({
  initialLeads,
  initialCorporateLeads,
  courses,
  batches,
  students,
  trainers,
  categories,
  payments,
  certificates,
  testimonials,
  blogs,
  notificationSettings,
  notificationLogs,
  faqs = [],
  homepageContent = [],
  oneOnOneRequests = [],
  contactRequests = []
}: AdminCrmWidgetProps) {
  const router = useRouter();
  
  // Tabs
  type TabType = 'overview' | 'enquiries' | 'courses' | 'categories' | 'tutors' | 'batches' | 'students' | 'payments' | 'testimonials' | 'corporate' | 'notifications' | 'settings' | 'homepageCms' | 'faqs' | 'oneOnOne' | 'contacts';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to extract CMS values
  const getCmsValue = (section: string, key: string, defaultValue: string = '') => {
    const entry = homepageContent.find(c => c.section === section && c.key === key);
    return entry ? entry.value : defaultValue;
  };

  // FAQ lists & Form
  const [faqsList, setFaqsList] = useState<any[]>(faqs);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [faqForm, setFaqForm] = useState({
    id: '',
    question: '',
    answer: '',
    order: '0'
  });

  // 1-on-1 Requests list
  const [oneOnOneList, setOneOnOneList] = useState<any[]>(oneOnOneRequests);

  // Contact Requests list
  const [contactList, setContactList] = useState<any[]>(contactRequests);

  // Homepage CMS State
  const [homepageForm, setHomepageForm] = useState({
    hero_title: getCmsValue('hero', 'title', 'Advance Your Career With Industry Recognized Certifications'),
    hero_subtitle: getCmsValue('hero', 'subtitle', 'Learn from industry experts through live instructor-led training programs.'),
    hero_cta_primary: getCmsValue('hero', 'cta-primary', 'Explore Courses'),
    hero_cta_secondary: getCmsValue('hero', 'cta-secondary', 'Book Free Consultation'),
    hero_stats_learners: getCmsValue('hero', 'stats-learners', '5000'),
    hero_stats_courses: getCmsValue('hero', 'stats-courses', '100'),
    hero_stats_trainers: getCmsValue('hero', 'stats-trainers', '50')
  });

  // ----------------------------------------------------
  // FORM STATES & EDITING TRIGGERS
  // ----------------------------------------------------
  
  // Courses Form
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [courseForm, setCourseForm] = useState({
    id: '',
    name: '',
    price: '',
    duration: '',
    level: 'Beginner',
    image: '',
    mentorName: '',
    mentorExp: '',
    mentorAvatar: '',
    mentorBio: '',
    categoryId: '',
    syllabus: '',
    faqs: '',
    brochure: '',
    description: '',
    certificationBody: '',
    skillsCovered: '',
    courseHighlights: '',
    seoData: ''
  });

  // Category Form
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryName, setCategoryName] = useState('');

  // Tutor Form
  const [editingTutor, setEditingTutor] = useState<any | null>(null);
  const [tutorForm, setTutorForm] = useState({
    id: '',
    name: '',
    email: '',
    avatar: '',
    bio: '',
    specialty: ''
  });

  // Batch Form
  const [editingBatch, setEditingBatch] = useState<any | null>(null);
  const [batchForm, setBatchForm] = useState({
    id: '',
    courseSource: 'existing', // 'existing' or 'custom'
    courseId: '',
    customCourseName: '',
    trainerSource: 'existing', // 'existing' or 'custom'
    trainerId: '',
    customTrainerName: '',
    batchType: 'Weekend', // Weekend / Weekday / Fast Track / Corporate
    trainingMode: 'Online Classroom', // Online Classroom / Self-Paced / Corporate Training
    startDate: '',
    endDate: '',
    timeZone: 'IST',
    classTiming: '',
    status: 'Upcoming', // Upcoming / Ongoing / Completed
    seatsTotal: '30',
    seatsLeft: '30',
    linkZoom: 'https://zoom.us/j/mock-meeting',
    notes: ''
  });

  // Testimonial Form
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    id: '',
    name: '',
    role: '',
    quote: '',
    rating: '5',
    featured: true,
    initial: ''
  });

  // Blog Form
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogForm, setBlogForm] = useState({
    id: '',
    title: '',
    content: '',
    category: '',
    image: '',
    tags: ''
  });

  // Website Settings Form (persisted to LocalStorage)
  const [settingsForm, setSettingsForm] = useState({
    logo: 'Aurenza Academy',
    contactPhone: '+91 7013057827',
    contactEmail: 'info@aurenzaacademy.com',
    contactWhatsapp: '+91 7013057827',
    socialLinkedin: 'https://linkedin.com/company/aurenza-academy',
    socialTwitter: 'https://twitter.com/aurenza_academy',
    socialYoutube: 'https://youtube.com/aurenza_academy',
    gatewayKeyId: 'rzp_test_mock12345KeyId',
    gatewayKeySecret: 'mock12345SecretKeyCredentials'
  });

  // Notification Configuration State (Phase 9)
  const [notificationConfig, setNotificationConfig] = useState({
    email_enabled: 'true',
    whatsapp_enabled: 'true',
    tpl_enrollment_subject: '',
    tpl_enrollment_body: '',
    tpl_reminder_subject: '',
    tpl_reminder_body: '',
    tpl_certificate_subject: '',
    tpl_certificate_body: ''
  });

  // Sync Notification Settings (Phase 9)
  useEffect(() => {
    if (notificationSettings && notificationSettings.length > 0) {
      const configObj: Record<string, string> = {};
      notificationSettings.forEach((item: any) => {
        configObj[item.key] = item.value;
      });
      setNotificationConfig(prev => ({
        ...prev,
        ...configObj
      }));
    }
  }, [notificationSettings]);

  // Lead Notes state for CRM leads
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});

  // Sync edit selectors on default change
  useEffect(() => {
    if (courses.length > 0 && !courseForm.categoryId) {
      setCourseForm(prev => ({ ...prev, categoryId: categories[0]?.id || '' }));
    }
    if (courses.length > 0 && !batchForm.courseId) {
      setBatchForm(prev => ({
        ...prev,
        courseId: courses[0]?.id || '',
        trainerId: trainers[0]?.id || '',
        customCourseName: courses[0]?.name || '',
        customTrainerName: trainers[0]?.name || ''
      }));
    }
  }, [courses, trainers, categories]);

  // Load Settings from Prop (Database) or fallback to LocalStorage if browser context
  useEffect(() => {
    if (notificationSettings && notificationSettings.length > 0) {
      const dbSettings: any = {};
      notificationSettings.forEach(s => {
        dbSettings[s.key] = s.value;
      });
      setSettingsForm(prev => ({
        ...prev,
        ...dbSettings
      }));
    } else if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aurenza_settings');
      if (saved) {
        try {
          setSettingsForm(prev => ({ ...prev, ...JSON.parse(saved) }));
        } catch (e) {
          // fallback to defaults
        }
      }
    }
  }, [notificationSettings]);

  // ----------------------------------------------------
  // MUTATION HANDLERS
  // ----------------------------------------------------

  // Course Mutations
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Saving program blueprints...", { id: "action" });
    
    const res = await saveCourseAction(courseForm);
    setLoading(false);
    if (res.success) {
      toast.success("Course details saved successfully!", { id: "action" });
      setEditingCourse(null);
      setCourseForm({
        id: '', name: '', price: '', duration: '', level: 'Beginner',
        image: '', mentorName: '', mentorExp: '', mentorAvatar: '', mentorBio: '',
        categoryId: categories[0]?.id || '', syllabus: '', faqs: '',
        brochure: '', description: '', certificationBody: '',
        skillsCovered: '', courseHighlights: '', seoData: ''
      });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save course.", { id: "action" });
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course and all associated lessons?")) return;
    toast.loading("Removing course catalog entry...", { id: "action" });
    const res = await deleteCourseAction(id);
    if (res.success) {
      toast.success("Course removed successfully.", { id: "action" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete.", { id: "action" });
    }
  };

  // Category Mutations
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    toast.loading("Saving category index...", { id: "action" });
    const res = await saveCategoryAction({ id: editingCategory?.id, name: categoryName });
    if (res.success) {
      toast.success("Category details saved!", { id: "action" });
      setCategoryName('');
      setEditingCategory(null);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save category.", { id: "action" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? All courses inside will lose category links.")) return;
    toast.loading("Removing category record...", { id: "action" });
    const res = await deleteCategoryAction(id);
    if (res.success) {
      toast.success("Category deleted.", { id: "action" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete.", { id: "action" });
    }
  };

  // Trainer Mutations
  const handleSaveTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Registering tutor profile...", { id: "action" });
    const res = await saveTrainerAction(tutorForm);
    if (res.success) {
      toast.success("Trainer profile updated!", { id: "action" });
      setEditingTutor(null);
      setTutorForm({ id: '', name: '', email: '', avatar: '', bio: '', specialty: '' });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save tutor.", { id: "action" });
    }
  };

  const handleDeleteTrainer = async (id: string) => {
    if (!confirm("Remove this trainer profile? They will be unassigned from live cohorts.")) return;
    toast.loading("Removing tutor record...", { id: "action" });
    const res = await deleteTrainerAction(id);
    if (res.success) {
      toast.success("Tutor record removed.", { id: "action" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to remove tutor.", { id: "action" });
    }
  };

  // Batch Mutations
  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const courseNameInput = batchForm.courseSource === 'existing' 
      ? courses.find(c => c.id === batchForm.courseId)?.name 
      : batchForm.customCourseName;
      
    if (!courseNameInput || !courseNameInput.trim()) {
      toast.error("Please specify a course name.");
      return;
    }

    const trainerNameInput = batchForm.trainerSource === 'existing'
      ? trainers.find(t => t.id === batchForm.trainerId)?.name
      : batchForm.customTrainerName;
      
    if (!trainerNameInput || !trainerNameInput.trim()) {
      toast.error("Please specify a trainer name.");
      return;
    }

    if (!batchForm.startDate || !batchForm.classTiming) {
      toast.error("Start date and class timing slots are required.");
      return;
    }

    toast.loading("Scheduling live batch time slot...", { id: "action" });
    
    const timeSlotJson = JSON.stringify({
      courseSource: batchForm.courseSource,
      customCourseName: batchForm.customCourseName,
      trainerSource: batchForm.trainerSource,
      customTrainerName: batchForm.customTrainerName,
      batchType: batchForm.batchType,
      trainingMode: batchForm.trainingMode,
      startDate: batchForm.startDate,
      endDate: batchForm.endDate,
      timeZone: batchForm.timeZone,
      classTiming: batchForm.classTiming,
      status: batchForm.status,
      notes: batchForm.notes
    });

    const payload = {
      id: batchForm.id,
      courseId: batchForm.courseSource === 'existing' ? batchForm.courseId : (courses[0]?.id || ''),
      trainerId: batchForm.trainerSource === 'existing' ? batchForm.trainerId : (trainers[0]?.id || ''),
      startDate: batchForm.startDate,
      timeSlot: timeSlotJson,
      seatsTotal: batchForm.seatsTotal,
      seatsLeft: batchForm.seatsLeft,
      linkZoom: batchForm.linkZoom
    };

    const res = await saveBatchAction(payload);
    if (res.success) {
      toast.success("Live cohort registered!", { id: "action" });
      setEditingBatch(null);
      setBatchForm({
        id: '',
        courseSource: 'existing',
        courseId: courses[0]?.id || '',
        customCourseName: courses[0]?.name || '',
        trainerSource: 'existing',
        trainerId: trainers[0]?.id || '',
        customTrainerName: trainers[0]?.name || '',
        batchType: 'Weekend',
        trainingMode: 'Online Classroom',
        startDate: '',
        endDate: '',
        timeZone: 'IST',
        classTiming: '',
        status: 'Upcoming',
        seatsTotal: '30',
        seatsLeft: '30',
        linkZoom: 'https://zoom.us/j/mock-meeting',
        notes: ''
      });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save batch.", { id: "action" });
    }
  };

  const handleEditClick = (b: any) => {
    const parsed = parseBatchData(b, courses, trainers);
    setEditingBatch(b.id);
    setBatchForm({
      id: b.id,
      courseSource: parsed.courseSource,
      courseId: b.courseId,
      customCourseName: parsed.courseName,
      trainerSource: parsed.trainerSource,
      trainerId: b.trainerId,
      customTrainerName: parsed.trainerName,
      batchType: parsed.batchType,
      trainingMode: parsed.trainingMode,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      timeZone: parsed.timeZone,
      classTiming: parsed.classTiming,
      status: parsed.status,
      seatsTotal: b.seatsTotal.toString(),
      seatsLeft: b.seatsLeft.toString(),
      linkZoom: b.linkZoom,
      notes: parsed.notes
    });
  };

  const handleDuplicateClick = (b: any) => {
    const parsed = parseBatchData(b, courses, trainers);
    setEditingBatch('new');
    setBatchForm({
      id: '',
      courseSource: parsed.courseSource,
      courseId: b.courseId,
      customCourseName: parsed.courseSource === 'custom' ? `${parsed.courseName} (Copy)` : parsed.courseName,
      trainerSource: parsed.trainerSource,
      trainerId: b.trainerId,
      customTrainerName: parsed.trainerName,
      batchType: parsed.batchType,
      trainingMode: parsed.trainingMode,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      timeZone: parsed.timeZone,
      classTiming: parsed.classTiming,
      status: parsed.status,
      seatsTotal: b.seatsTotal.toString(),
      seatsLeft: b.seatsLeft.toString(),
      linkZoom: b.linkZoom,
      notes: parsed.notes
    });
    toast.success("Batch details duplicated! Review and save.", { id: "action" });
  };

  const handleDeleteBatch = async (id: string) => {
    if (!confirm("Cancel this live batch session?")) return;
    toast.loading("Removing batch schedule...", { id: "action" });
    const res = await deleteBatchAction(id);
    if (res.success) {
      toast.success("Batch canceled.", { id: "action" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to cancel.", { id: "action" });
    }
  };

  // Lead Status & Notes
  const handleStatusChange = async (leadId: string, newStatus: string, currentNotes: string) => {
    toast.loading("Updating lead position in pipeline...", { id: "crm" });
    const res = await updateLeadStatusAction(leadId, newStatus, currentNotes);
    if (res.success) {
      toast.success(`Lead moved to: ${newStatus}`, { id: "crm" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update lead.", { id: "crm" });
    }
  };

  const handleSaveLeadNotes = async (leadId: string, status: string) => {
    const notes = leadNotes[leadId] || '';
    toast.loading("Logging counselor contact notes...", { id: "crm" });
    const res = await updateLeadStatusAction(leadId, status, notes);
    if (res.success) {
      toast.success("Counselor notes updated!", { id: "crm" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save notes.", { id: "crm" });
    }
  };

  // Payments / Refunds approvals
  const handleUpdatePaymentStatus = async (paymentId: string, newStatus: string) => {
    toast.loading(`Processing refund resolution: ${newStatus}...`, { id: "payments" });
    const res = await updatePaymentStatusAction(paymentId, newStatus);
    if (res.success) {
      toast.success(`Transaction status resolved to: ${newStatus}`, { id: "payments" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update payment status.", { id: "payments" });
    }
  };

  // Testimonial Mutations
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Moderating review details...", { id: "action" });
    const res = await saveTestimonialAction(testimonialForm);
    if (res.success) {
      toast.success("Student review registered!", { id: "action" });
      setEditingTestimonial(null);
      setTestimonialForm({ id: '', name: '', role: '', quote: '', rating: '5', featured: true, initial: '' });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save review.", { id: "action" });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Delete this student testimonial?")) return;
    toast.loading("Removing review...", { id: "action" });
    const res = await deleteTestimonialAction(id);
    if (res.success) {
      toast.success("Testimonial deleted.", { id: "action" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete.", { id: "action" });
    }
  };

  // Blog Mutations
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Publishing blog write-up...", { id: "action" });
    const res = await saveBlogAction(blogForm);
    if (res.success) {
      toast.success("Blog article index updated!", { id: "action" });
      setEditingBlog(null);
      setBlogForm({ id: '', title: '', content: '', category: '', image: '', tags: '' });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save blog.", { id: "action" });
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    toast.loading("Deleting article index...", { id: "action" });
    const res = await deleteBlogAction(id);
    if (res.success) {
      toast.success("Blog article deleted.", { id: "action" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete blog.", { id: "action" });
    }
  };

  // Settings Save to Database
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Saving settings configurations...", { id: "settings" });
    const res = await saveNotificationSettingsAction(settingsForm);
    setLoading(false);
    if (res.success) {
      toast.success("Branding configuration and gateway API keys saved in database!", { id: "settings" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save settings.", { id: "settings" });
    }
  };

  // FAQ Mutations
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Saving FAQ...", { id: "faq-action" });
    const res = await saveFaqAction(faqForm);
    setLoading(false);
    if (res.success) {
      toast.success("FAQ saved successfully!", { id: "faq-action" });
      setEditingFaq(null);
      setFaqForm({ id: '', question: '', answer: '', order: '0' });
      if (faqForm.id) {
        setFaqsList(prev => prev.map(f => f.id === faqForm.id ? res.data : f));
      } else {
        setFaqsList(prev => [...prev, res.data].sort((a, b) => a.order - b.order));
      }
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save FAQ.", { id: "faq-action" });
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    setLoading(true);
    toast.loading("Deleting FAQ...", { id: "faq-action" });
    const res = await deleteFaqAction(id);
    setLoading(false);
    if (res.success) {
      toast.success("FAQ deleted successfully!", { id: "faq-action" });
      setFaqsList(prev => prev.filter(f => f.id !== id));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete FAQ.", { id: "faq-action" });
    }
  };

  // Homepage CMS Mutations
  const handleSaveHomepageCms = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Updating Homepage Content...", { id: "cms-action" });
    
    const entries: Record<string, string> = {
      "title": homepageForm.hero_title,
      "subtitle": homepageForm.hero_subtitle,
      "cta-primary": homepageForm.hero_cta_primary,
      "cta-secondary": homepageForm.hero_cta_secondary,
      "stats-learners": homepageForm.hero_stats_learners,
      "stats-courses": homepageForm.hero_stats_courses,
      "stats-trainers": homepageForm.hero_stats_trainers
    };

    const res = await saveHomepageContentBulkAction("hero", entries);
    setLoading(false);
    if (res.success) {
      toast.success("Homepage content updated in database!", { id: "cms-action" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save homepage content.", { id: "cms-action" });
    }
  };

  // 1-on-1 Requests Status Mutation
  const handleUpdateOneOnOneStatus = async (requestId: string, status: string) => {
    setLoading(true);
    toast.loading("Updating request status...", { id: "req-action" });
    const res = await updateOneOnOneRequestStatusAction(requestId, status);
    setLoading(false);
    if (res.success) {
      toast.success(`Request status updated to ${status}!`, { id: "req-action" });
      setOneOnOneList(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update request status.", { id: "req-action" });
    }
  };

  // Save Notification Engine Settings (Phase 9)
  const handleSaveNotificationSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Saving notification engine configurations...", { id: "notifications" });
    const res = await saveNotificationSettingsAction(notificationConfig);
    setLoading(false);
    if (res.success) {
      toast.success("Notification settings and templates updated!", { id: "notifications" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update notification settings.", { id: "notifications" });
    }
  };

  // Certificate Issuance handler
  const [certForm, setCertForm] = useState({ studentId: '', name: '', courseId: '' });
  useEffect(() => {
    if (students.length > 0 && !certForm.studentId) {
      setCertForm({
        studentId: students[0].id,
        name: students[0].name,
        courseId: courses[0]?.id || ''
      });
    }
  }, [students, courses]);

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.studentId || !certForm.courseId || !certForm.name.trim()) {
      toast.error("Please specify a student name and target course.");
      return;
    }
    toast.loading("Minting cryptographic certificate...", { id: "cert" });
    const course = courses.find(c => c.id === certForm.courseId);
    const res = await generateCertificateAction(
      certForm.studentId,
      certForm.name,
      certForm.courseId,
      course?.name || "Advanced Specialization Program"
    );
    if (res.success) {
      toast.success(`Verification cert issued! ID: ${res.certificate?.certId}`, { id: "cert", duration: 6000 });
      setCertForm(prev => ({ ...prev, name: '' }));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to issue certificate.", { id: "cert" });
    }
  };

  // Filtered Lists
  const filteredCourses = courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredLeads = initialLeads.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.course.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCorporate = initialCorporateLeads.filter(l => l.company.toLowerCase().includes(searchQuery.toLowerCase()) || l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // CRM Kanban Columns
  const KANBAN_COLUMNS = ['NEW', 'CONTACTED', 'INTERESTED', 'CONVERTED', 'LOST'];

  // Helper formatting for currency
  const formatInr = (num: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start font-sans">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 bg-white border border-borderLight rounded-[24px] p-5 shadow-soft flex flex-col gap-1.5 shrink-0">
        <span className="text-[9px] font-black uppercase text-textSecondary px-3 tracking-widest block mb-2">Management Controls</span>
        
        {[
          { id: 'overview', label: 'Overview Dashboard', icon: <Home className="w-4 h-4" /> },
          { id: 'enquiries', label: 'Course Enquiries', icon: <Users className="w-4 h-4" /> },
          { id: 'courses', label: 'Courses Hub', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'categories', label: 'Categories Hub', icon: <Folder className="w-4 h-4" /> },
          { id: 'tutors', label: 'Tutors & Mentors', icon: <Users className="w-4 h-4" /> },
          { id: 'batches', label: 'Batches & Live', icon: <Calendar className="w-4 h-4" /> },
          { id: 'testimonials', label: 'Reviews & Quotes', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'corporate', label: 'Corporate Leads', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'homepageCms', label: 'Homepage CMS', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'faqs', label: 'General FAQs', icon: <HelpCircle className="w-4 h-4" /> },
          { id: 'oneOnOne', label: '1-on-1 Requests', icon: <Clock className="w-4 h-4" /> },
          { id: 'contacts', label: 'Contact Logs', icon: <Mail className="w-4 h-4" /> },
          { id: 'settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as TabType);
              setSearchQuery('');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-glowPurple'
                : 'text-textSecondary hover:text-primary hover:bg-sectionBg'
            }`}
          >
            <span className="flex items-center gap-2.5">
              {tab.icon}
              {tab.label}
            </span>
            {tab.id === 'corporate' && initialCorporateLeads.filter(c => c.status === 'New').length > 0 && (
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${activeTab === 'corporate' ? 'bg-white text-primary' : 'bg-rose-500 text-white animate-pulse'}`}>
                {initialCorporateLeads.filter(c => c.status === 'New').length}
              </span>
            )}
            {tab.id === 'oneOnOne' && oneOnOneList.filter(r => r.status === 'Pending').length > 0 && (
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${activeTab === 'oneOnOne' ? 'bg-white text-primary' : 'bg-rose-500 text-white animate-pulse'}`}>
                {oneOnOneList.filter(r => r.status === 'Pending').length}
              </span>
            )}
            {tab.id === 'payments' && payments.filter(p => p.status === 'Pending').length > 0 && (
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${activeTab === 'payments' ? 'bg-white text-primary' : 'bg-amber-500 text-white animate-pulse'}`}>
                {payments.filter(p => p.status === 'Pending').length}
              </span>
            )}
          </button>
        ))}
      </aside>

      {/* 2. MAIN HUB WORKSPACE */}
      <main className="flex-1 w-full bg-white border border-borderLight p-6 rounded-[28px] shadow-soft min-h-[600px] relative">
        
        {/* Universal Search Bar on top for relevant tabs */}
        {['courses', 'corporate', 'enquiries'].includes(activeTab) && (
          <div className="flex items-center gap-3 bg-sectionBg border border-borderLight rounded-xl px-3 py-2 mb-6">
            <Search className="w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-textPrimary placeholder-neutral-400 w-full focus:ring-0"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-textSecondary hover:text-textPrimary text-xs font-bold">Clear</button>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" /> Academy Administration Overview
              </h3>
              <p className="text-xs text-textSecondary mt-1">Quick operational indicators, conversions tracking, and recent activity ledgers.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Operational Ratios */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-textPrimary flex items-center gap-1.5 border-b border-borderLight pb-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Key Performance Highlights
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sectionBg p-3.5 rounded-xl border border-borderLight">
                    <span className="text-[10px] text-textSecondary font-bold block uppercase tracking-wider">Lead Conversion Rate</span>
                    <strong className="text-lg font-extrabold text-primary heading mt-1 block">
                      {initialLeads.length > 0
                        ? `${Math.round((initialLeads.filter(l => l.status === 'CONVERTED').length / initialLeads.length) * 100)}%`
                        : '0%'
                      }
                    </strong>
                  </div>
                  <div className="bg-sectionBg p-3.5 rounded-xl border border-borderLight">
                    <span className="text-[10px] text-textSecondary font-bold block uppercase tracking-wider">Average Course Rating</span>
                    <strong className="text-lg font-extrabold text-amber-500 heading mt-1 block flex items-center gap-1">
                      4.9 <Sparkles className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                    </strong>
                  </div>
                  <div className="bg-sectionBg p-3.5 rounded-xl border border-borderLight">
                    <span className="text-[10px] text-textSecondary font-bold block uppercase tracking-wider">Moderated Testimonials</span>
                    <strong className="text-lg font-extrabold text-successGreen heading mt-1 block">
                      {testimonials.length} Reviews
                    </strong>
                  </div>
                  <div className="bg-sectionBg p-3.5 rounded-xl border border-borderLight">
                    <span className="text-[10px] text-textSecondary font-bold block uppercase tracking-wider">Corporate Leads</span>
                    <strong className="text-lg font-extrabold text-secondary heading mt-1 block">
                      {initialCorporateLeads.length} Enquiries
                    </strong>
                  </div>
                </div>
              </div>

              {/* Fast Activity Actions */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-textPrimary flex items-center gap-1.5 border-b border-borderLight pb-2">
                  <RefreshCw className="w-4 h-4 text-secondary animate-spin-slow" /> Quick Shortcuts
                </h4>
                <div className="grid gap-2.5 text-xs">
                  <button onClick={() => setActiveTab('courses')} className="w-full text-left p-3 rounded-xl hover:bg-primary/5 hover:text-primary border border-borderLight transition flex items-center justify-between font-bold">
                    <span>Create / Modify Certification Course</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveTab('enquiries')} className="w-full text-left p-3 rounded-xl hover:bg-primary/5 hover:text-primary border border-borderLight transition flex items-center justify-between font-bold">
                    <span>Manage Course Enquiries</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveTab('batches')} className="w-full text-left p-3 rounded-xl hover:bg-primary/5 hover:text-primary border border-borderLight transition flex items-center justify-between font-bold">
                    <span>Schedule Live Timetable Cohort</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick CRM Pipeline Peek */}
            <div className="border border-borderLight rounded-2xl p-5 space-y-3.5">
              <div className="flex justify-between items-center border-b border-borderLight pb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-textPrimary flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary" /> Active Leads CRM Pipeline
                </h4>
                <button onClick={() => setActiveTab('enquiries')} className="text-[10px] text-primary font-bold hover:underline">View Enquiries</button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {KANBAN_COLUMNS.map(col => {
                  const count = initialLeads.filter(l => l.status === col).length;
                  return (
                    <div key={col} className="bg-sectionBg p-3 rounded-xl border border-borderLight text-center space-y-1">
                      <span className="text-[9px] font-black text-textSecondary block uppercase tracking-wider">{col}</span>
                      <strong className="text-sm font-extrabold text-textPrimary heading">{count}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: COURSES HUB */}
        {/* ======================================================== */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-borderLight pb-4">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Course Blueprint Configuration
                </h3>
                <p className="text-xs text-textSecondary mt-1">Publish, update, and manage all student-facing curriculum parameters.</p>
              </div>
              {!editingCourse && (
                <button
                  onClick={() => {
                    setEditingCourse('new');
                    setCourseForm({
                      id: '', name: '', price: '', duration: '', level: 'Beginner',
                      image: '', mentorName: '', mentorExp: '', mentorAvatar: '', mentorBio: '',
                      categoryId: categories[0]?.id || '', syllabus: '', faqs: '',
                      brochure: '', description: '', certificationBody: '',
                      skillsCovered: '', courseHighlights: '', seoData: ''
                    });
                  }}
                  className="px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primaryHover transition flex items-center gap-1.5 shadow-soft"
                >
                  <PlusCircle className="w-4 h-4" /> Add Course Blueprint
                </button>
              )}
            </div>

            {editingCourse ? (
              <form onSubmit={handleSaveCourse} className="space-y-4 bg-sectionBg border border-borderLight p-6 rounded-2xl animate-fade-up">
                <div className="flex justify-between items-center border-b border-borderLight pb-3 mb-2">
                  <h4 className="text-xs font-black uppercase text-primary tracking-wider">
                    {editingCourse === 'new' ? 'Create Course Form' : `Edit: ${courseForm.name}`}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="p-1 rounded-full hover:bg-white text-textSecondary transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Course Name</label>
                    <input
                      type="text"
                      required
                      value={courseForm.name}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. AWS Solutions Architect"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Select Category Alignment</label>
                    <select
                      value={courseForm.categoryId}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="glass-input bg-white text-textPrimary"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Price (₹ INR)</label>
                    <input
                      type="number"
                      required
                      value={courseForm.price}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g. 24999"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Duration</label>
                    <input
                      type="text"
                      required
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g. 40 Hours"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Curriculum Skill Level</label>
                    <select
                      value={courseForm.level}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, level: e.target.value }))}
                      className="glass-input bg-white text-textPrimary"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Beginner -> Advanced">Beginner {"->"} Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <FileUploadWidget
                    label="Banner Thumbnail Image"
                    value={courseForm.image}
                    onChange={(url) => setCourseForm(prev => ({ ...prev, image: url }))}
                    bucket="courses"
                  />

                  <FileUploadWidget
                    label="Course Brochure PDF"
                    value={courseForm.brochure}
                    onChange={(url) => setCourseForm(prev => ({ ...prev, brochure: url }))}
                    bucket="brochures"
                    accept="application/pdf"
                  />

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Course Description</label>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter detailed description of the course..."
                      className="glass-input min-h-[80px]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Certification Body</label>
                    <input
                      type="text"
                      value={courseForm.certificationBody}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, certificationBody: e.target.value }))}
                      placeholder="e.g. PMI, Scrum Alliance, AWS"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Skills Covered (comma separated)</label>
                    <input
                      type="text"
                      value={courseForm.skillsCovered}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, skillsCovered: e.target.value }))}
                      placeholder="e.g. Java, Spring Boot, React"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Course Highlights (comma separated)</label>
                    <input
                      type="text"
                      value={courseForm.courseHighlights}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, courseHighlights: e.target.value }))}
                      placeholder="e.g. 100% Placement, 1-on-1 Mentorship"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">SEO Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={courseForm.seoData}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, seoData: e.target.value }))}
                      placeholder="e.g. java, full stack, coding bootcamp"
                      className="glass-input"
                    />
                  </div>

                  <div className="border-t border-borderLight col-span-2 pt-3 my-1">
                    <span className="text-[10px] font-black uppercase text-textSecondary tracking-wider block mb-2">Mentor Settings</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Trainer / Mentor Name</label>
                    <input
                      type="text"
                      required
                      value={courseForm.mentorName}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, mentorName: e.target.value }))}
                      placeholder="e.g. Rahul Sharma"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Mentor Experience</label>
                    <input
                      type="text"
                      required
                      value={courseForm.mentorExp}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, mentorExp: e.target.value }))}
                      placeholder="e.g. 10+ Years Exp at AWS & Microsoft"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Mentor Avatar (Initials or URL)</label>
                    <input
                      type="text"
                      value={courseForm.mentorAvatar}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, mentorAvatar: e.target.value }))}
                      placeholder="e.g. RS"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Mentor Biography Summary</label>
                    <textarea
                      value={courseForm.mentorBio}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, mentorBio: e.target.value }))}
                      placeholder="Short professional credentials bio..."
                      rows={2}
                      className="glass-input resize-none font-sans"
                    />
                  </div>

                  <div className="border-t border-borderLight col-span-2 pt-3 my-1">
                    <span className="text-[10px] font-black uppercase text-textSecondary tracking-wider block mb-2">Syllabus Curriculum & FAQs</span>
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide flex items-center gap-1.5">
                      Syllabus Modules (JSON Array)
                    </label>
                    <textarea
                      value={courseForm.syllabus}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, syllabus: e.target.value }))}
                      placeholder='e.g. [{"module": "Mod 1: Introduction", "details": "Core foundations"}]'
                      rows={3}
                      className="glass-input font-mono bg-white text-[11px]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Course FAQs (JSON Array)</label>
                    <textarea
                      value={courseForm.faqs}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, faqs: e.target.value }))}
                      placeholder='e.g. [{"q": "Is training live?", "a": "Yes, live weekend sessions."}]'
                      rows={3}
                      className="glass-input font-mono bg-white text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2 border border-borderLight hover:bg-white text-textPrimary font-bold rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-primary text-white hover:bg-primaryHover font-black rounded-xl text-xs hover:shadow-glowPurple transition shadow-soft flex items-center gap-1.5"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="xs" className="brightness-150 text-white" />
                        Saving...
                      </>
                    ) : "Save Blueprints"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredCourses.map((c) => {
                  const cat = categories.find(cat => cat.id === c.categoryId);
                  return (
                    <div key={c.id} className="bg-white border border-borderLight p-4 rounded-2xl shadow-soft flex flex-col justify-between hover:shadow-premium hover:-translate-y-0.5 transition duration-200">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="px-2.5 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[8px] font-black uppercase tracking-wider">
                            {cat ? cat.name : "Uncategorized"}
                          </span>
                          <strong className="text-xs font-bold text-successGreen heading">{formatInr(c.price)}</strong>
                        </div>

                        <div>
                          <h4 className="text-xs font-extrabold text-textPrimary heading line-clamp-1">{c.name}</h4>
                          <p className="text-[10px] text-textSecondary font-semibold mt-1">Duration: {c.duration} | Level: {c.level}</p>
                        </div>

                        <div className="flex items-center gap-2 bg-sectionBg border border-borderLight p-2 rounded-xl text-[10px] text-textSecondary">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                            {c.mentorAvatar || c.mentorName[0] || 'M'}
                          </div>
                          <div>
                            <span className="font-extrabold text-textPrimary block">{c.mentorName}</span>
                            <span className="line-clamp-1 text-[9px]">{c.mentorExp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-4 border-t border-borderLight mt-4 text-[10px] font-bold">
                        <button
                          onClick={() => {
                            setEditingCourse(c.id);
                            setCourseForm({
                              id: c.id,
                              name: c.name,
                              price: c.price.toString(),
                              duration: c.duration,
                              level: c.level,
                              image: c.image || '',
                              mentorName: c.mentorName,
                              mentorExp: c.mentorExp,
                              mentorAvatar: c.mentorAvatar || '',
                              mentorBio: c.mentorBio || '',
                              categoryId: c.categoryId,
                              syllabus: c.syllabus || '',
                              faqs: c.faqs || '',
                              brochure: c.brochure || '',
                              description: c.description || '',
                              certificationBody: c.certificationBody || '',
                              skillsCovered: c.skillsCovered || '',
                              courseHighlights: c.courseHighlights || '',
                              seoData: c.seoData || ''
                            });
                          }}
                          className="flex-1 py-2 border border-borderLight hover:border-primary hover:text-primary rounded-xl text-center transition flex items-center justify-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Blueprints
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="p-2 border border-borderLight hover:border-dangerRed hover:text-dangerRed rounded-xl transition text-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CATEGORIES HUB */}
        {/* ======================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <Folder className="w-5 h-5 text-primary" /> Categories & Nav Index
                </h3>
                <p className="text-xs text-textSecondary mt-1">Organize courses into high-value SEO and catalog structures.</p>
              </div>
            </div>

            <form onSubmit={handleSaveCategory} className="flex gap-2 text-xs">
              <input
                type="text"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name (e.g. Cloud Computing)"
                className="glass-input flex-1"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-white font-black rounded-xl hover:bg-primaryHover hover:shadow-glowPurple transition shrink-0"
              >
                {editingCategory ? 'Save Change' : 'Create Category'}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryName('');
                  }}
                  className="px-3 border border-borderLight rounded-xl text-textPrimary transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="border border-borderLight rounded-2xl overflow-hidden shadow-soft text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sectionBg border-b border-borderLight font-extrabold text-[10px] text-textSecondary uppercase tracking-wider">
                    <th className="p-4">Category Name</th>
                    <th className="p-4">URL Slug</th>
                    <th className="p-4 text-center">Courses Count</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight">
                  {categories.map((cat) => {
                    const cCount = courses.filter(c => c.categoryId === cat.id).length;
                    return (
                      <tr key={cat.id} className="hover:bg-sectionBg/40 transition">
                        <td className="p-4 font-extrabold text-textPrimary heading">{cat.name}</td>
                        <td className="p-4 text-textSecondary font-mono">{cat.slug}</td>
                        <td className="p-4 text-center font-bold">{cCount}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setCategoryName(cat.name);
                            }}
                            className="p-1.5 border border-borderLight rounded-lg hover:border-primary hover:text-primary transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 border border-borderLight rounded-lg hover:border-dangerRed hover:text-dangerRed transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: TUTORS & MENTORS */}
        {/* ======================================================== */}
        {activeTab === 'tutors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-borderLight pb-4">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Tutors & Mentors Management
                </h3>
                <p className="text-xs text-textSecondary mt-1">Manage trainer profiles and view assigned course cohorts.</p>
              </div>
              {!editingTutor && (
                <button
                  onClick={() => {
                    setEditingTutor('new');
                    setTutorForm({ id: '', name: '', email: '', avatar: '', bio: '', specialty: '' });
                  }}
                  className="px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primaryHover transition flex items-center gap-1.5 shadow-soft"
                >
                  <PlusCircle className="w-4 h-4" /> Add Tutor Profile
                </button>
              )}
            </div>

            {editingTutor ? (
              <form onSubmit={handleSaveTrainer} className="space-y-4 bg-sectionBg border border-borderLight p-6 rounded-2xl animate-fade-up">
                <div className="flex justify-between items-center border-b border-borderLight pb-3 mb-2">
                  <h4 className="text-xs font-black uppercase text-primary tracking-wider">
                    {editingTutor === 'new' ? 'New Tutor Form' : `Edit: ${tutorForm.name}`}
                  </h4>
                  <button type="button" onClick={() => setEditingTutor(null)} className="p-1 rounded-full hover:bg-white text-textSecondary transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      value={tutorForm.name}
                      onChange={(e) => setTutorForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Rahul Sharma"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Professional Email</label>
                    <input
                      type="email"
                      required
                      value={tutorForm.email}
                      onChange={(e) => setTutorForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. rahul@aurenza.com"
                      className="glass-input"
                    />
                  </div>

                  <FileUploadWidget
                    label="Tutor Photo / Avatar"
                    value={tutorForm.avatar}
                    onChange={(url) => setTutorForm(prev => ({ ...prev, avatar: url }))}
                    bucket="trainers"
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Specialty Domain</label>
                    <input
                      type="text"
                      value={tutorForm.specialty}
                      onChange={(e) => setTutorForm(prev => ({ ...prev, specialty: e.target.value }))}
                      placeholder="e.g. Cloud Computing & DevOps"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Professional Bio Summary</label>
                    <textarea
                      value={tutorForm.bio}
                      onChange={(e) => setTutorForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Summary of experience, credentials, and achievements..."
                      rows={3}
                      className="glass-input resize-none font-sans"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                  <button
                    type="button"
                    onClick={() => setEditingTutor(null)}
                    className="px-4 py-2 border border-borderLight hover:bg-white text-textPrimary font-bold rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white hover:bg-primaryHover font-black rounded-xl text-xs transition shadow-soft"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {trainers.map((t) => {
                  const assignedBatches = batches.filter(b => b.trainerId === t.id);
                  return (
                    <div key={t.id} className="bg-white border border-borderLight p-5 rounded-2xl shadow-soft hover:shadow-premium transition flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-sm shadow-soft">
                            {t.avatar || t.name[0]}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-textPrimary heading leading-none">{t.name}</h4>
                            <p className="text-[10px] text-textSecondary mt-1.5">{t.email}</p>
                          </div>
                        </div>

                        <div className="text-[10px] space-y-1.5">
                          <p className="text-textSecondary leading-relaxed"><span className="font-bold text-textPrimary uppercase tracking-wider text-[8px]">Bio:</span> {t.bio || "No biography details logged."}</p>
                          <p className="text-textSecondary"><span className="font-bold text-textPrimary uppercase tracking-wider text-[8px]">Specialty:</span> <strong className="text-textPrimary">{t.specialty || "Unassigned"}</strong></p>
                        </div>

                        {assignedBatches.length > 0 && (
                          <div className="pt-3 border-t border-borderLight space-y-1">
                            <span className="text-[8px] font-black text-textSecondary uppercase tracking-wider block">Assigned Batches ({assignedBatches.length})</span>
                            <div className="flex flex-wrap gap-1">
                              {assignedBatches.map(b => {
                                const course = courses.find(c => c.id === b.courseId);
                                return (
                                  <span key={b.id} className="px-2 py-0.5 bg-sectionBg border border-borderLight rounded text-[8px] text-textPrimary font-semibold">
                                    {course ? course.name : "Syllabus Program"}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 border-t border-borderLight pt-4 mt-4 text-[10px] font-bold">
                        <button
                          onClick={() => {
                            setEditingTutor(t.id);
                            setTutorForm({
                              id: t.id,
                              name: t.name,
                              email: t.email,
                              avatar: t.avatar || '',
                              bio: t.bio || '',
                              specialty: t.specialty || ''
                            });
                          }}
                          className="flex-1 py-2 border border-borderLight hover:border-primary hover:text-primary rounded-xl text-center transition flex items-center justify-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Profile
                        </button>
                        <button
                          onClick={() => handleDeleteTrainer(t.id)}
                          className="p-2 border border-borderLight hover:border-dangerRed hover:text-dangerRed rounded-xl transition text-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: BATCHES & LIVE */}
        {/* ======================================================== */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-borderLight pb-4">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Batches & Live Timetable Slots
                </h3>
                <p className="text-xs text-textSecondary mt-1">Schedule live interactive cohorts and update links.</p>
              </div>
              {!editingBatch && (
                <button
                  onClick={() => {
                    setEditingBatch('new');
                    setBatchForm({
                      id: '',
                      courseSource: 'existing',
                      courseId: courses[0]?.id || '',
                      customCourseName: courses[0]?.name || '',
                      trainerSource: 'existing',
                      trainerId: trainers[0]?.id || '',
                      customTrainerName: trainers[0]?.name || '',
                      batchType: 'Weekend',
                      trainingMode: 'Online Classroom',
                      startDate: '',
                      endDate: '',
                      timeZone: 'IST',
                      classTiming: '',
                      status: 'Upcoming',
                      seatsTotal: '30',
                      seatsLeft: '30',
                      linkZoom: 'https://zoom.us/j/mock-meeting',
                      notes: ''
                    });
                  }}
                  className="px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primaryHover transition flex items-center gap-1.5 shadow-soft"
                >
                  <PlusCircle className="w-4 h-4" /> Create Cohort Batch
                </button>
              )}
            </div>

            {editingBatch ? (
              <form onSubmit={handleSaveBatch} className="space-y-5 bg-white border border-borderLight p-6 rounded-2xl animate-fade-up shadow-soft text-textPrimary">
                <div className="flex justify-between items-center border-b border-borderLight pb-3 mb-2">
                  <h4 className="text-xs font-black uppercase text-primary tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4.5 h-4.5 text-primary" />
                    {editingBatch === 'new' ? 'Create Upcoming Live Batch' : 'Modify Live Schedule'}
                  </h4>
                  <button type="button" onClick={() => setEditingBatch(null)} className="p-1 rounded-full hover:bg-neutral-100 text-textSecondary transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 text-xs">
                  {/* Course Source Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Course Source</label>
                    <div className="flex gap-4 items-center h-10 px-1">
                      <label className="flex items-center gap-2 font-bold cursor-pointer text-textSecondary hover:text-textPrimary">
                        <input
                          type="radio"
                          name="courseSource"
                          value="existing"
                          checked={batchForm.courseSource === 'existing'}
                          onChange={() => {
                            const defaultCourse = courses[0];
                            setBatchForm(prev => ({ 
                              ...prev, 
                              courseSource: 'existing',
                              courseId: defaultCourse?.id || '',
                              customCourseName: defaultCourse?.name || ''
                            }));
                          }}
                          className="w-3.5 h-3.5 text-primary focus:ring-primary/20 accent-primary"
                        />
                        Existing Course
                      </label>
                      <label className="flex items-center gap-2 font-bold cursor-pointer text-textSecondary hover:text-textPrimary">
                        <input
                          type="radio"
                          name="courseSource"
                          value="custom"
                          checked={batchForm.courseSource === 'custom'}
                          onChange={() => {
                            setBatchForm(prev => ({ 
                              ...prev, 
                              courseSource: 'custom',
                              courseId: '',
                              customCourseName: ''
                            }));
                          }}
                          className="w-3.5 h-3.5 text-primary focus:ring-primary/20 accent-primary"
                        />
                        Custom Course (Manual Entry)
                      </label>
                    </div>
                  </div>

                  {/* Select Course Program (dropdown) */}
                  <div className="flex flex-col gap-1.5">
                    {batchForm.courseSource === 'existing' ? (
                      <>
                        <label className="font-bold text-textSecondary uppercase tracking-wide">Select Course Program</label>
                        <select
                          value={batchForm.courseId}
                          onChange={(e) => {
                            const cid = e.target.value;
                            const course = courses.find(c => c.id === cid);
                            setBatchForm(prev => ({
                              ...prev,
                              courseId: cid,
                              customCourseName: course ? course.name : ''
                            }));
                          }}
                          className="glass-input bg-white text-textPrimary h-10 rounded-xl"
                        >
                          {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      // Visual spacing placeholder to keep layout structured side by side
                      <div className="hidden sm:block"></div>
                    )}
                  </div>

                  {/* Course Name (Editable text input) */}
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">
                      Course Name {batchForm.courseSource === 'existing' && <span className="text-[10px] text-neutral-400 font-normal lowercase">(auto-populated, manually editable)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={batchForm.customCourseName}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, customCourseName: e.target.value }))}
                      placeholder="Enter custom course name, e.g. Certified Scrum Product Owner (CSPO)"
                      className="glass-input h-10"
                    />
                  </div>

                  {/* Trainer Source Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Trainer Source</label>
                    <div className="flex gap-4 items-center h-10 px-1">
                      <label className="flex items-center gap-2 font-bold cursor-pointer text-textSecondary hover:text-textPrimary">
                        <input
                          type="radio"
                          name="trainerSource"
                          value="existing"
                          checked={batchForm.trainerSource === 'existing'}
                          onChange={() => {
                            const defaultTrainer = trainers[0];
                            setBatchForm(prev => ({ 
                              ...prev, 
                              trainerSource: 'existing',
                              trainerId: defaultTrainer?.id || '',
                              customTrainerName: defaultTrainer?.name || ''
                            }));
                          }}
                          className="w-3.5 h-3.5 text-primary focus:ring-primary/20 accent-primary"
                        />
                        Existing Trainer
                      </label>
                      <label className="flex items-center gap-2 font-bold cursor-pointer text-textSecondary hover:text-textPrimary">
                        <input
                          type="radio"
                          name="trainerSource"
                          value="custom"
                          checked={batchForm.trainerSource === 'custom'}
                          onChange={() => {
                            setBatchForm(prev => ({ 
                              ...prev, 
                              trainerSource: 'custom',
                              trainerId: '',
                              customTrainerName: ''
                            }));
                          }}
                          className="w-3.5 h-3.5 text-primary focus:ring-primary/20 accent-primary"
                        />
                        Custom Trainer Name
                      </label>
                    </div>
                  </div>

                  {/* Select Trainer (dropdown) */}
                  <div className="flex flex-col gap-1.5">
                    {batchForm.trainerSource === 'existing' ? (
                      <>
                        <label className="font-bold text-textSecondary uppercase tracking-wide">Select Assigned Tutor (Trainer)</label>
                        <select
                          value={batchForm.trainerId}
                          onChange={(e) => {
                            const tid = e.target.value;
                            const trainer = trainers.find(t => t.id === tid);
                            setBatchForm(prev => ({
                              ...prev,
                              trainerId: tid,
                              customTrainerName: trainer ? trainer.name : ''
                            }));
                          }}
                          className="glass-input bg-white text-textPrimary h-10 rounded-xl"
                        >
                          {trainers.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      // Visual spacing placeholder
                      <div className="hidden sm:block"></div>
                    )}
                  </div>

                  {/* Trainer Name (Editable text input) */}
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">
                      Trainer Name {batchForm.trainerSource === 'existing' && <span className="text-[10px] text-neutral-400 font-normal lowercase">(auto-populated, manually editable)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={batchForm.customTrainerName}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, customTrainerName: e.target.value }))}
                      placeholder="Enter custom trainer name, e.g. Zuzana Sochova"
                      className="glass-input h-10"
                    />
                  </div>

                  {/* Batch Type & Training Mode */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Batch Type</label>
                    <select
                      value={batchForm.batchType}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, batchType: e.target.value }))}
                      className="glass-input bg-white text-textPrimary h-10 rounded-xl"
                    >
                      <option value="Weekend">Weekend Batch</option>
                      <option value="Weekday">Weekday Batch</option>
                      <option value="Fast Track">Fast Track</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Training Mode</label>
                    <select
                      value={batchForm.trainingMode}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, trainingMode: e.target.value }))}
                      className="glass-input bg-white text-textPrimary h-10 rounded-xl"
                    >
                      <option value="Online Classroom">Online Classroom</option>
                      <option value="Self-Paced">Self-Paced</option>
                      <option value="Corporate Training">Corporate Training</option>
                    </select>
                  </div>

                  {/* Start Date, End Date, Time Zone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Start Date</label>
                    <input
                      type="text"
                      required
                      value={batchForm.startDate}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, startDate: e.target.value }))}
                      placeholder="e.g. Jun 20, 2026"
                      className="glass-input h-10"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">End Date</label>
                    <input
                      type="text"
                      value={batchForm.endDate}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, endDate: e.target.value }))}
                      placeholder="e.g. Jun 21, 2026"
                      className="glass-input h-10"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Time Zone</label>
                    <input
                      type="text"
                      required
                      value={batchForm.timeZone}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, timeZone: e.target.value }))}
                      placeholder="e.g. IST, EST, UTC"
                      className="glass-input h-10"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Class Timing</label>
                    <input
                      type="text"
                      required
                      value={batchForm.classTiming}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, classTiming: e.target.value }))}
                      placeholder="e.g. 04:30 PM - 12:30 AM"
                      className="glass-input h-10"
                    />
                  </div>

                  {/* Batch Status, Seats Total, Seats Available */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Batch Status</label>
                    <select
                      value={batchForm.status}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, status: e.target.value }))}
                      className="glass-input bg-white text-textPrimary h-10 rounded-xl"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Seats Total</label>
                    <input
                      type="number"
                      required
                      value={batchForm.seatsTotal}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, seatsTotal: e.target.value }))}
                      placeholder="e.g. 30"
                      className="glass-input h-10"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Seats Available (Left)</label>
                    <input
                      type="number"
                      required
                      value={batchForm.seatsLeft}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, seatsLeft: e.target.value }))}
                      placeholder="e.g. 30"
                      className="glass-input h-10"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Meeting URL (Optional)</label>
                    <input
                      type="text"
                      value={batchForm.linkZoom}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, linkZoom: e.target.value }))}
                      placeholder="e.g. https://zoom.us/j/mock-meeting"
                      className="glass-input h-10"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Notes (Optional)</label>
                    <textarea
                      value={batchForm.notes}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Enter internal notes, course syllabus highlights, special requests, etc."
                      rows={3}
                      className="glass-input p-3 resize-none rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                  <button
                    type="button"
                    onClick={() => setEditingBatch(null)}
                    className="px-4 py-2 border border-borderLight hover:bg-neutral-50 text-textPrimary font-bold rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-primaryHover text-white font-black rounded-xl text-xs transition shadow-soft hover:shadow-glowPurple"
                  >
                    Save Schedule
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white border border-borderLight rounded-2xl overflow-hidden shadow-soft">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-borderLight bg-sectionBg/70 text-textPrimary font-bold uppercase text-[9px] tracking-wider">
                        <th className="p-4.5 font-black">Course Name</th>
                        <th className="p-4.5 font-black">Trainer</th>
                        <th className="p-4.5 font-black">Dates</th>
                        <th className="p-4.5 font-black">Timing</th>
                        <th className="p-4.5 font-black">Batch Type</th>
                        <th className="p-4.5 font-black">Status</th>
                        <th className="p-4.5 text-right font-black">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderLight text-[11px] text-textSecondary font-semibold">
                      {batches.length > 0 ? (
                        batches.map((b) => {
                          const parsed = parseBatchData(b, courses, trainers);
                          const isUpcoming = parsed.status === 'Upcoming';
                          const isOngoing = parsed.status === 'Ongoing';
                          
                          return (
                            <tr key={b.id} className="hover:bg-sectionBg/30 transition duration-200">
                              <td className="p-4.5">
                                <div className="flex flex-col">
                                  <strong className="text-textPrimary font-extrabold">{parsed.courseName}</strong>
                                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{parsed.categoryName}</span>
                                </div>
                              </td>
                              <td className="p-4.5 text-textPrimary">
                                <div className="flex flex-col">
                                  <span className="font-bold">{parsed.trainerName}</span>
                                  <span className="text-[9px] text-neutral-400">{parsed.trainerSpecialty}</span>
                                </div>
                              </td>
                              <td className="p-4.5 text-textPrimary whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                  <span>
                                    {parsed.startDate}
                                    {parsed.endDate ? ` - ${parsed.endDate}` : ''}
                                    {parsed.timeZone ? ` (${parsed.timeZone})` : ''}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4.5 text-textPrimary whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                  <span>{parsed.classTiming}</span>
                                </div>
                              </td>
                              <td className="p-4.5">
                                <span className="px-2 py-0.5 rounded bg-purple-50 text-primary border border-primary/10 text-[9px] font-bold">
                                  {parsed.batchType}
                                </span>
                              </td>
                              <td className="p-4.5">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                                  isOngoing 
                                    ? 'bg-successGreen/5 border-successGreen/20 text-[#008556]'
                                    : isUpcoming
                                      ? 'bg-blue-50 border-blue-100 text-blue-600'
                                      : 'bg-neutral-100 border-neutral-200 text-neutral-500'
                                }`}>
                                  {parsed.status}
                                </span>
                              </td>
                              <td className="p-4.5 text-right whitespace-nowrap">
                                <div className="inline-flex gap-1.5">
                                  {/* Edit */}
                                  <button
                                    type="button"
                                    onClick={() => handleEditClick(b)}
                                    className="p-1.5 border border-borderLight hover:border-primary hover:text-primary rounded-lg transition"
                                    title="Edit Batch"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  
                                  {/* Duplicate */}
                                  <button
                                    type="button"
                                    onClick={() => handleDuplicateClick(b)}
                                    className="p-1.5 border border-borderLight hover:border-primary hover:text-primary rounded-lg transition"
                                    title="Duplicate Batch"
                                  >
                                    <PlusCircle className="w-3.5 h-3.5 text-primary" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteBatch(b.id)}
                                    className="p-1.5 border border-borderLight hover:border-dangerRed hover:text-dangerRed rounded-lg transition"
                                    title="Delete Batch"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-dangerRed" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-10 text-center text-textSecondary font-bold">
                            No batches scheduled. Click "Create Cohort Batch" to schedule a slot.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: LEARNERS ROSTER */}
        {/* ======================================================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Registered Learners Roster
              </h3>
              <p className="text-xs text-textSecondary mt-1">Review student registry details, module completion progress, and issue verified credentials.</p>
            </div>

            {/* Credential Issuance Panel */}
            <form onSubmit={handleIssueCertificate} className="bg-sectionBg border border-borderLight p-5 rounded-2xl space-y-4 text-xs">
              <h4 className="font-extrabold text-textPrimary flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <Award className="w-4 h-4 text-primary" /> Issue Verification Certificate
              </h4>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-textSecondary uppercase tracking-wide">Select Student</label>
                  <select
                    value={certForm.studentId}
                    onChange={(e) => {
                      const st = students.find(s => s.id === e.target.value);
                      setCertForm(prev => ({
                        ...prev,
                        studentId: e.target.value,
                        name: st ? st.name : ''
                      }));
                    }}
                    className="glass-input bg-white text-textPrimary"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-textSecondary uppercase tracking-wide">Certificate Recipient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Certified Name"
                    value={certForm.name}
                    onChange={(e) => setCertForm(prev => ({ ...prev, name: e.target.value }))}
                    className="glass-input"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-textSecondary uppercase tracking-wide">Select Program</label>
                  <select
                    value={certForm.courseId}
                    onChange={(e) => setCertForm(prev => ({ ...prev, courseId: e.target.value }))}
                    className="glass-input bg-white text-textPrimary"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-white font-black hover:bg-primaryHover hover:shadow-glowPurple transition rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                Generate Cryptographic Credential <Sparkles className="w-3.5 h-3.5 text-secondary" />
              </button>
            </form>

            <div className="border border-borderLight rounded-2xl overflow-hidden shadow-soft text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sectionBg border-b border-borderLight font-extrabold text-[10px] text-textSecondary uppercase tracking-wider">
                    <th className="p-4">Student</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4 text-center">Progress Percentage</th>
                    <th className="p-4 text-right">Registry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight">
                  {students.map((student) => {
                    // find enrollments/payments for progress simulation
                    return (
                      <tr key={student.id} className="hover:bg-sectionBg/40 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                              {student.avatar || student.name[0]}
                            </div>
                            <div>
                              <strong className="text-textPrimary font-extrabold heading block">{student.name}</strong>
                              <span className="text-[9px] text-textSecondary">{student.bio || 'Learner'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-textSecondary font-semibold">
                          <p className="flex items-center gap-1"><Mail className="w-3 h-3 text-secondary shrink-0" /> {student.email}</p>
                          <p className="flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-primary shrink-0" /> {student.phone || 'N/A'}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center flex-col justify-center gap-1.5 w-32 mx-auto">
                            <div className="flex justify-between w-full text-[9px] font-bold text-textSecondary">
                              <span>Syllabus Tracker</span>
                              <span>75%</span>
                            </div>
                            <div className="w-full bg-sectionBg h-1.5 rounded-full overflow-hidden border border-borderLight">
                              <div className="bg-successGreen h-full rounded-full" style={{ width: '75%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right text-textSecondary font-mono">
                          {new Date(student.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: PAYMENTS & REVENUE */}
        {/* ======================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Payments Ledger & Refund Actions
              </h3>
              <p className="text-xs text-textSecondary mt-1">Audit billing transactions history, track refund requests, and download ledgers.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="bg-sectionBg border border-borderLight p-4.5 rounded-2xl text-xs space-y-1 shadow-soft">
                <span className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">Gross Revenues</span>
                <strong className="text-xl font-extrabold text-successGreen heading block">
                  {formatInr(payments.reduce((acc, p) => p.status === 'Success' ? acc + p.amount : acc, 0))}
                </strong>
              </div>
              <div className="bg-sectionBg border border-borderLight p-4.5 rounded-2xl text-xs space-y-1 shadow-soft">
                <span className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">Total Refunded Value</span>
                <strong className="text-xl font-extrabold text-dangerRed heading block">
                  {formatInr(payments.reduce((acc, p) => p.status === 'Refunded' ? acc + p.amount : acc, 0))}
                </strong>
              </div>
              <div className="bg-sectionBg border border-borderLight p-4.5 rounded-2xl text-xs space-y-1 shadow-soft">
                <span className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">Gross Transactions Count</span>
                <strong className="text-xl font-extrabold text-primary heading block">{payments.length} Settlements</strong>
              </div>
            </div>

            <div className="border border-borderLight rounded-2xl overflow-hidden shadow-soft text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sectionBg border-b border-borderLight font-extrabold text-[10px] text-textSecondary uppercase tracking-wider">
                    <th className="p-4">Tx ID</th>
                    <th className="p-4">Target Course</th>
                    <th className="p-4 text-center">Amount</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Moderate Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight">
                  {payments.map((p) => {
                    const c = courses.find(course => course.id === p.courseId);
                    return (
                      <tr key={p.id} className="hover:bg-sectionBg/40 transition">
                        <td className="p-4 font-mono font-bold text-textPrimary select-all">{p.txId}</td>
                        <td className="p-4 text-textSecondary font-semibold">
                          <p className="text-textPrimary line-clamp-1">{c ? c.name : "Syllabus Program"}</p>
                          <p className="text-[8px] text-textSecondary mt-0.5 uppercase tracking-wide">ID: {p.userId}</p>
                        </td>
                        <td className="p-4 text-center font-bold text-textPrimary">{formatInr(p.amount)}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                            p.status === 'Success'
                              ? 'bg-successGreen/5 text-successGreen border-successGreen/15'
                              : p.status === 'Refunded'
                              ? 'bg-dangerRed/5 text-dangerRed border-dangerRed/15'
                              : 'bg-amber-500/5 text-amber-500 border-amber-500/15'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {p.status === 'Success' && (
                            <>
                              <button
                                onClick={() => handleUpdatePaymentStatus(p.id, 'Refunded')}
                                className="px-2.5 py-1 text-[9px] font-bold border border-dangerRed hover:bg-dangerRed hover:text-white rounded text-dangerRed transition"
                              >
                                Approve Refund
                              </button>
                              <button
                                onClick={() => handleUpdatePaymentStatus(p.id, 'Rejected')}
                                className="px-2.5 py-1 text-[9px] font-bold border border-borderLight hover:bg-sectionBg rounded text-textPrimary transition"
                              >
                                Reject Refund
                              </button>
                            </>
                          )}
                          {p.status !== 'Success' && (
                            <span className="text-[10px] text-textSecondary italic">Settled</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: TESTIMONIALS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-borderLight pb-4">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Review & Testimonials Moderation
                </h3>
                <p className="text-xs text-textSecondary mt-1">Manage public review quotes displayed on the website catalog page.</p>
              </div>
              {!editingTestimonial && (
                <button
                  onClick={() => {
                    setEditingTestimonial('new');
                    setTestimonialForm({ id: '', name: '', role: '', quote: '', rating: '5', featured: true, initial: '' });
                  }}
                  className="px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primaryHover transition flex items-center gap-1.5 shadow-soft"
                >
                  <PlusCircle className="w-4 h-4" /> Add Review Quote
                </button>
              )}
            </div>

            {editingTestimonial ? (
              <form onSubmit={handleSaveTestimonial} className="space-y-4 bg-sectionBg border border-borderLight p-6 rounded-2xl animate-fade-up">
                <div className="flex justify-between items-center border-b border-borderLight pb-3 mb-2">
                  <h4 className="text-xs font-black uppercase text-primary tracking-wider">
                    {editingTestimonial === 'new' ? 'New Testimonial Form' : `Edit Testimonial`}
                  </h4>
                  <button type="button" onClick={() => setEditingTestimonial(null)} className="p-1 rounded-full hover:bg-white text-textSecondary transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Student Name</label>
                    <input
                      type="text"
                      required
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Ananya Sharma"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Role Credentials</label>
                    <input
                      type="text"
                      required
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Software Engineer at Microsoft"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Rating Star Rank</label>
                    <select
                      value={testimonialForm.rating}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, rating: e.target.value }))}
                      className="glass-input bg-white text-textPrimary"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Featured Approved Flag</label>
                    <select
                      value={testimonialForm.featured ? "true" : "false"}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, featured: e.target.value === 'true' }))}
                      className="glass-input bg-white text-textPrimary"
                    >
                      <option value="true">Approved (Featured on site)</option>
                      <option value="false">Moderation Queue (Hidden)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Student Review Quote</label>
                    <textarea
                      value={testimonialForm.quote}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, quote: e.target.value }))}
                      placeholder="Enter the student's review quotation..."
                      rows={3}
                      className="glass-input resize-none font-sans"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="px-4 py-2 border border-borderLight hover:bg-white text-textPrimary font-bold rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white hover:bg-primaryHover font-black rounded-xl text-xs transition shadow-soft"
                  >
                    Save Review Quote
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 text-xs">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white border border-borderLight p-5 rounded-2xl shadow-soft flex flex-col justify-between hover:shadow-premium transition">
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {t.initial || t.name[0]}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-textPrimary heading block">{t.name}</h4>
                            <span className="text-[9px] text-textSecondary">{t.role}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${t.featured ? 'bg-successGreen/5 text-successGreen border border-successGreen/10' : 'bg-amber-500/5 text-amber-500 border border-amber-500/10'}`}>
                          {t.featured ? 'Featured' : 'Moderating'}
                        </span>
                      </div>

                      <p className="text-textSecondary italic leading-relaxed text-[11px]">"{t.quote}"</p>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Sparkles key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-borderLight pt-4 mt-4 font-bold text-[10px]">
                      <button
                        onClick={() => {
                          setEditingTestimonial(t.id);
                          setTestimonialForm({
                            id: t.id,
                            name: t.name,
                            role: t.role,
                            quote: t.quote,
                            rating: t.rating.toString(),
                            featured: t.featured,
                            initial: t.initial || ''
                          });
                        }}
                        className="flex-1 py-2 border border-borderLight hover:border-primary hover:text-primary rounded-xl text-center transition flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Review
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="p-2 border border-borderLight hover:border-dangerRed hover:text-dangerRed rounded-xl transition text-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* TAB: COURSE ENQUIRIES */}
        {/* ======================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 animate-fade-up">
            <div className="border-b border-borderLight pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Individual Course Enquiries
                </h3>
                <p className="text-xs text-textSecondary mt-1">Manage inquiries submitted by prospective learners, update contact status, and log callback notes.</p>
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 bg-sectionBg border border-borderLight border-dashed rounded-2xl text-textSecondary">
                <p className="text-xs font-semibold">No active enquiries found matching filters.</p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2 text-xs">
                {filteredLeads.map((lead: any) => (
                  <div key={lead.id} className="bg-white border border-borderLight p-5 rounded-2xl shadow-soft hover:shadow-premium transition-all space-y-4">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest block">Learner Enquiry</span>
                        <h4 className="text-sm font-extrabold text-textPrimary heading mt-1">{lead.name}</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[9px] font-bold">
                        {lead.course}
                      </span>
                    </div>

                    {/* Contact Info & Date */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-sectionBg border border-borderLight rounded-xl text-[10px] text-textSecondary">
                      <div>
                        <span className="font-extrabold block text-textSecondary text-[8px] uppercase tracking-wide">Contact Details</span>
                        <strong className="text-textPrimary mt-1 block">{lead.phone}</strong>
                        <p className="text-textPrimary mt-0.5 truncate">{lead.email || <span className="italic text-neutral-400">No Email Provided</span>}</p>
                      </div>
                      <div>
                        <span className="font-extrabold block text-textSecondary text-[8px] uppercase tracking-wide">Enquiry Date & Time</span>
                        <p className="text-textPrimary mt-1 font-bold">{new Date(lead.createdAt).toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Message */}
                    {lead.message && (
                      <div className="p-3 bg-sectionBg border border-borderLight rounded-xl text-[10px] text-textSecondary leading-relaxed italic">
                        "{lead.message}"
                      </div>
                    )}

                    {/* Status & Notes Form */}
                    <div className="space-y-3 pt-2 border-t border-borderLight">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-[9px] font-bold text-textSecondary uppercase tracking-wide">Status Stage:</span>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value, lead.notes || '')}
                          className="px-2.5 py-1 bg-white border border-borderLight rounded-lg text-[10px] font-bold text-textPrimary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="CONVERTED">Closed</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-textSecondary uppercase tracking-wide block">Follow-up Notes</label>
                        <div className="flex gap-2 items-end">
                          <textarea
                            value={leadNotes[lead.id] !== undefined ? leadNotes[lead.id] : (lead.notes || '')}
                            onChange={(e) => setLeadNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                            placeholder="Add administrative notes..."
                            className="flex-1 p-2.5 bg-sectionBg border border-borderLight rounded-xl text-[10px] font-semibold text-textPrimary placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            rows={2}
                          />
                          <button
                            onClick={() => handleSaveLeadNotes(lead.id, lead.status)}
                            className="px-3 py-2 bg-primary hover:bg-primaryHover text-white text-[10px] font-bold rounded-xl transition shadow-soft shrink-0 h-10 flex items-center justify-center"
                          >
                            Save Notes
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: CORPORATE LEADS */}
        {/* ======================================================== */}
        {activeTab === 'corporate' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" /> Corporate Enterprise B2B Leads
                </h3>
                <p className="text-xs text-textSecondary mt-1">Review requirements sent by corporate human resources teams and managers.</p>
              </div>
            </div>

            {filteredCorporate.length === 0 ? (
              <div className="text-center py-10 bg-sectionBg border border-borderLight border-dashed rounded-2xl text-textSecondary">
                <p>No active enterprise leads found matching search filters.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 text-xs">
                {filteredCorporate.map((c) => (
                  <div key={c.id} className="bg-white border border-borderLight p-5 rounded-2xl shadow-soft hover:shadow-premium transition space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-black text-primary uppercase tracking-wider block">Enterprise Account</span>
                        <h4 className="text-sm font-extrabold text-textPrimary heading mt-1">{c.company}</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[9px] font-bold">
                        {c.size} Employees
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-sectionBg border border-borderLight rounded-xl text-[10px] text-textSecondary">
                      <div>
                        <span className="font-extrabold block text-textSecondary text-[8px] uppercase tracking-wide">Rep Representative</span>
                        <strong className="text-textPrimary mt-0.5 block">{c.name}</strong>
                      </div>
                      <div>
                        <span className="font-extrabold block text-textSecondary text-[8px] uppercase tracking-wide">Contacts Info</span>
                        <p className="text-textPrimary mt-0.5 truncate">{c.email}</p>
                        <p className="text-textPrimary mt-0.5">{c.phone}</p>
                      </div>
                    </div>

                    {c.message && (
                      <div className="p-3 bg-sectionBg border border-borderLight rounded-xl text-[10px] text-textSecondary leading-relaxed italic">
                        "{c.message}"
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-borderLight">
                      <span className="text-[9px] font-bold text-textSecondary uppercase tracking-wider">Status Stage:</span>
                      <span className="px-2 py-0.5 bg-successGreen/5 border border-successGreen/10 rounded text-[9px] font-bold text-successGreen">
                        {c.status || "New"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 10: BLOG MANAGEMENT (Removed) */}

        {/* ======================================================== */}
        {/* TAB 12: NOTIFICATION ENGINE (Phase 9) */}
        {/* ======================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-8 animate-fadeIn text-xs text-textPrimary">
            <div className="border-b border-borderLight pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" /> Notification Engine & Message Templates
                </h3>
                <p className="text-xs text-textSecondary mt-1">
                  Manage automated communications, toggle channels, customize templates, and audit system logs.
                </p>
              </div>
              <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/10">
                Resend + Meta WhatsApp Simulator
              </span>
            </div>

            <form onSubmit={handleSaveNotificationSettings} className="space-y-6">
              {/* Channel Toggles Card */}
              <div className="bg-white border border-borderLight rounded-2xl p-5 space-y-4 shadow-soft">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-primary border-b border-borderLight pb-2">
                  Gateway Integration Channels
                </h4>
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Email Gateway */}
                  <div className="flex items-center justify-between p-4 bg-sectionBg border border-borderLight rounded-xl">
                    <div className="space-y-1">
                      <span className="font-extrabold block">Email Broadcast Gateway (Resend / SendGrid)</span>
                      <span className="text-[10px] text-textSecondary">Simulate via Resend / SendGrid API integrations.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNotificationConfig((prev) => ({
                          ...prev,
                          email_enabled: prev.email_enabled === 'true' ? 'false' : 'true'
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                        notificationConfig.email_enabled === 'true' ? 'bg-primary' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          notificationConfig.email_enabled === 'true' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* WhatsApp Gateway */}
                  <div className="flex items-center justify-between p-4 bg-sectionBg border border-borderLight rounded-xl">
                    <div className="space-y-1">
                      <span className="font-extrabold block">WhatsApp Alerts Gateway (Twilio / Meta API)</span>
                      <span className="text-[10px] text-textSecondary">Simulate via Twilio / Meta WhatsApp Business API.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNotificationConfig((prev) => ({
                          ...prev,
                          whatsapp_enabled: prev.whatsapp_enabled === 'true' ? 'false' : 'true'
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                        notificationConfig.whatsapp_enabled === 'true' ? 'bg-successGreen' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          notificationConfig.whatsapp_enabled === 'true' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Template Parameters Reference */}
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4.5 space-y-2">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Available Placeholders Reference</span>
                <p className="text-[10px] text-textSecondary leading-relaxed">
                  Inject dynamic parameters into template subject and body fields:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['{studentName}', '{courseName}', '{amount}', '{timeSlot}', '{certId}'].map((placeholder) => (
                    <code key={placeholder} className="px-2 py-1 rounded bg-white border border-borderLight text-primary text-[10px] font-mono font-bold">
                      {placeholder}
                    </code>
                  ))}
                </div>
              </div>

              {/* Templates Section */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* ENROLLMENT */}
                <div className="bg-white border border-borderLight rounded-2xl p-5 space-y-4 shadow-soft">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[8px] font-black uppercase tracking-wider block w-fit">
                    Enrollment Confirmation
                  </span>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-textSecondary uppercase tracking-wide">Email Subject</label>
                      <input
                        type="text"
                        value={notificationConfig.tpl_enrollment_subject}
                        onChange={(e) =>
                          setNotificationConfig((prev) => ({ ...prev, tpl_enrollment_subject: e.target.value }))
                        }
                        className="glass-input"
                        placeholder="Welcome to Aurenza!"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-textSecondary uppercase tracking-wide">Message Content</label>
                      <textarea
                        value={notificationConfig.tpl_enrollment_body}
                        onChange={(e) =>
                          setNotificationConfig((prev) => ({ ...prev, tpl_enrollment_body: e.target.value }))
                        }
                        className="glass-input bg-white"
                        rows={6}
                        placeholder="Write enrollment message..."
                      />
                    </div>
                  </div>
                </div>

                {/* BATCH REMINDER */}
                <div className="bg-white border border-borderLight rounded-2xl p-5 space-y-4 shadow-soft">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary/5 text-secondary border border-secondary/10 text-[8px] font-black uppercase tracking-wider block w-fit">
                    Class Batch Reminders
                  </span>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-textSecondary uppercase tracking-wide">Email Subject</label>
                      <input
                        type="text"
                        value={notificationConfig.tpl_reminder_subject}
                        onChange={(e) =>
                          setNotificationConfig((prev) => ({ ...prev, tpl_reminder_subject: e.target.value }))
                        }
                        className="glass-input"
                        placeholder="Live session starting soon!"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-textSecondary uppercase tracking-wide">Message Content</label>
                      <textarea
                        value={notificationConfig.tpl_reminder_body}
                        onChange={(e) =>
                          setNotificationConfig((prev) => ({ ...prev, tpl_reminder_body: e.target.value }))
                        }
                        className="glass-input bg-white"
                        rows={6}
                        placeholder="Write class reminder details..."
                      />
                    </div>
                  </div>
                </div>

                {/* CERTIFICATE ISSUED */}
                <div className="bg-white border border-borderLight rounded-2xl p-5 space-y-4 shadow-soft">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/5 text-amber-600 border border-amber-500/10 text-[8px] font-black uppercase tracking-wider block w-fit">
                    Certificate Ready
                  </span>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-textSecondary uppercase tracking-wide">Email Subject</label>
                      <input
                        type="text"
                        value={notificationConfig.tpl_certificate_subject}
                        onChange={(e) =>
                          setNotificationConfig((prev) => ({ ...prev, tpl_certificate_subject: e.target.value }))
                        }
                        className="glass-input"
                        placeholder="Congratulations! Cert Issued"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-textSecondary uppercase tracking-wide">Message Content</label>
                      <textarea
                        value={notificationConfig.tpl_certificate_body}
                        onChange={(e) =>
                          setNotificationConfig((prev) => ({ ...prev, tpl_certificate_body: e.target.value }))
                        }
                        className="glass-input bg-white"
                        rows={6}
                        placeholder="Write certificate ready notification text..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Config */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-white font-black hover:bg-primaryHover hover:shadow-glowPurple transition rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="xs" className="brightness-150 text-white" />
                    Saving Configuration...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save Notification Configuration & Live Templates
                  </>
                )}
              </button>
            </form>

            {/* Notification logs panel */}
            <div className="border border-borderLight rounded-2xl p-5 space-y-4 bg-white shadow-soft">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-borderLight pb-3">
                <div>
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-textPrimary">
                    Sent Logs & Dispatch History Ledger
                  </h4>
                  <p className="text-[10px] text-textSecondary">
                    Verify outgoing transactional communications and delivery status.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-textSecondary bg-sectionBg border border-borderLight px-2.5 py-1 rounded-lg">
                  {notificationLogs.length} logs recorded
                </span>
              </div>

              {notificationLogs.length === 0 ? (
                <div className="py-8 text-center text-textSecondary text-[11px]">
                  No notifications have been dispatched yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-borderLight text-textSecondary font-bold text-[10px] uppercase tracking-wider">
                        <th className="py-2.5">Date / Time</th>
                        <th className="py-2.5">Type</th>
                        <th className="py-2.5">Channel</th>
                        <th className="py-2.5">Recipient</th>
                        <th className="py-2.5">Message / Content Preview</th>
                        <th className="py-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderLight">
                      {[...notificationLogs].reverse().map((log: any) => {
                        const dateStr = new Date(log.createdAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                        return (
                          <tr key={log.id} className="hover:bg-sectionBg transition text-[11px]">
                            <td className="py-3 font-semibold text-textSecondary">{dateStr}</td>
                            <td className="py-3 font-bold">
                              <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[9px] text-neutral-700">
                                {log.type}
                              </span>
                            </td>
                            <td className="py-3 font-semibold">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  log.channel === 'EMAIL'
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}
                              >
                                {log.channel}
                              </span>
                            </td>
                            <td className="py-3 font-mono text-textSecondary">{log.recipient}</td>
                            <td className="py-3 max-w-xs truncate text-textSecondary" title={log.content}>
                              {log.content}
                            </td>
                            <td className="py-3 text-right">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  log.status === 'DELIVERED' || log.status === 'SENT'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: HOMEPAGE CMS */}
        {/* ======================================================== */}
        {activeTab === 'homepageCms' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Homepage Content Management (CMS)
              </h3>
              <p className="text-xs text-textSecondary mt-1">Dynamically update the hero titles, CTA button labels, and floating metric counts on the landing page.</p>
            </div>

            <form onSubmit={handleSaveHomepageCms} className="space-y-6 text-xs text-textPrimary">
              {/* Hero Copy */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-primary border-b border-borderLight pb-2">Hero Copy & Text</h4>
                <div className="grid gap-4 sm:grid-cols-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Main Hero Title</label>
                    <input
                      type="text"
                      required
                      value={homepageForm.hero_title}
                      onChange={(e) => setHomepageForm(prev => ({ ...prev, hero_title: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Hero Subtitle</label>
                    <textarea
                      required
                      value={homepageForm.hero_subtitle}
                      onChange={(e) => setHomepageForm(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                      className="glass-input min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-secondary border-b border-borderLight pb-2">Call to Action Labels</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Primary CTA Button Label</label>
                    <input
                      type="text"
                      required
                      value={homepageForm.hero_cta_primary}
                      onChange={(e) => setHomepageForm(prev => ({ ...prev, hero_cta_primary: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Secondary CTA Button Label</label>
                    <input
                      type="text"
                      required
                      value={homepageForm.hero_cta_secondary}
                      onChange={(e) => setHomepageForm(prev => ({ ...prev, hero_cta_secondary: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Hero Stats */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-amber-500 border-b border-borderLight pb-2">Floating Metric Targets</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Learners Target Count</label>
                    <input
                      type="number"
                      required
                      value={homepageForm.hero_stats_learners}
                      onChange={(e) => setHomepageForm(prev => ({ ...prev, hero_stats_learners: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Elite Courses Target Count</label>
                    <input
                      type="number"
                      required
                      value={homepageForm.hero_stats_courses}
                      onChange={(e) => setHomepageForm(prev => ({ ...prev, hero_stats_courses: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Expert Mentors Target Count</label>
                    <input
                      type="number"
                      required
                      value={homepageForm.hero_stats_trainers}
                      onChange={(e) => setHomepageForm(prev => ({ ...prev, hero_stats_trainers: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white font-black hover:bg-primaryHover hover:shadow-glowPurple transition rounded-xl text-xs uppercase tracking-wider"
              >
                {loading ? "Updating Homepage CMS..." : "Publish Homepage Updates"}
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: GENERAL FAQS */}
        {/* ======================================================== */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" /> General FAQ Management
                </h3>
                <p className="text-xs text-textSecondary mt-1">Add, update, or remove site-wide frequently asked questions displayed on the FAQ support page.</p>
              </div>
              {!editingFaq && (
                <button
                  onClick={() => {
                    setEditingFaq('new');
                    setFaqForm({ id: '', question: '', answer: '', order: (faqsList.length + 1).toString() });
                  }}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-primaryHover hover:shadow-soft transition"
                >
                  <PlusCircle className="w-4 h-4" /> Add New FAQ
                </button>
              )}
            </div>

            {editingFaq && (
              <div className="border border-borderLight rounded-2xl p-5 bg-[#FAFAFC] space-y-4">
                <h4 className="font-extrabold text-xs text-textPrimary">
                  {editingFaq === 'new' ? "Add Site FAQ" : `Edit FAQ #${faqForm.id.substring(0, 6)}`}
                </h4>
                <form onSubmit={handleSaveFaq} className="space-y-4 text-xs font-semibold">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Question Text</label>
                    <textarea
                      required
                      value={faqForm.question}
                      onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                      className="glass-input min-h-[60px]"
                      placeholder="e.g., What are the prerequisites?"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Detailed Answer</label>
                    <textarea
                      required
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                      className="glass-input min-h-[100px]"
                      placeholder="Provide a detailed response..."
                    />
                  </div>
                  <div className="w-1/3 flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Sort Index (Order)</label>
                    <input
                      type="number"
                      required
                      value={faqForm.order}
                      onChange={(e) => setFaqForm(prev => ({ ...prev, order: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingFaq(null)}
                      className="px-4 py-2 border border-borderLight rounded-xl text-textSecondary font-bold hover:bg-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primaryHover transition"
                    >
                      Save FAQ
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!editingFaq && (
              <div className="bg-white border border-borderLight rounded-2xl overflow-hidden shadow-soft">
                {faqsList.length === 0 ? (
                  <div className="p-12 text-center text-textSecondary space-y-2">
                    <HelpCircle className="w-10 h-10 text-borderLight mx-auto" />
                    <p className="text-xs font-semibold">No general FAQs initialized yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-sectionBg border-b border-borderLight text-textSecondary font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4 w-16 text-center">Order</th>
                          <th className="p-4">Question</th>
                          <th className="p-4">Answer Summary</th>
                          <th className="p-4 w-24 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-borderLight font-medium">
                        {faqsList.map((faq) => (
                          <tr key={faq.id} className="hover:bg-sectionBg/50 transition">
                            <td className="p-4 text-center font-bold text-primary">{faq.order}</td>
                            <td className="p-4 font-extrabold text-textPrimary max-w-[200px] truncate">{faq.question}</td>
                            <td className="p-4 text-textSecondary max-w-[300px] truncate">{faq.answer}</td>
                            <td className="p-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingFaq(faq.id);
                                  setFaqForm({
                                    id: faq.id,
                                    question: faq.question,
                                    answer: faq.answer,
                                    order: faq.order.toString()
                                  });
                                }}
                                className="p-1.5 rounded hover:bg-sectionBg text-textSecondary hover:text-primary transition"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteFaq(faq.id)}
                                className="p-1.5 rounded hover:bg-sectionBg text-textSecondary hover:text-rose-500 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: 1-on-1 COUNSELING REQUESTS */}
        {/* ======================================================== */}
        {activeTab === 'oneOnOne' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> 1-on-1 Counseling Requests
              </h3>
              <p className="text-xs text-textSecondary mt-1">Review requests from students seeking personal roadmap reviews and live counseling call sessions.</p>
            </div>

            <div className="bg-white border border-borderLight rounded-2xl overflow-hidden shadow-soft">
              {oneOnOneList.length === 0 ? (
                <div className="p-12 text-center text-textSecondary space-y-2">
                  <Clock className="w-10 h-10 text-borderLight mx-auto animate-pulse" />
                  <p className="text-xs font-semibold">No 1-on-1 counseling calls booked yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-sectionBg border-b border-borderLight text-textSecondary font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Student</th>
                        <th className="p-4">Preferred Slot</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 w-32 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderLight font-medium">
                      {oneOnOneList.map((req) => (
                        <tr key={req.id} className="hover:bg-sectionBg/50 transition">
                          <td className="p-4">
                            <div className="font-extrabold text-textPrimary">{req.name}</div>
                            <div className="text-[10px] text-textSecondary">{new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                          <td className="p-4 text-primary font-bold">{req.preferredTime}</td>
                          <td className="p-4 space-y-0.5">
                            <div className="flex items-center gap-1 text-textSecondary"><Mail className="w-3.5 h-3.5 text-borderLight" /> {req.email}</div>
                            <div className="flex items-center gap-1 text-textSecondary"><Phone className="w-3.5 h-3.5 text-borderLight" /> {req.phone}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              req.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              req.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                              req.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                              'bg-amber-100 text-amber-700 animate-pulse'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 text-right flex justify-end gap-1">
                            {req.status !== 'Completed' && (
                              <button
                                onClick={() => handleUpdateOneOnOneStatus(req.id, 'Completed')}
                                className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-[10px] font-bold transition"
                                title="Mark Completed"
                              >
                                Done
                              </button>
                            )}
                            {req.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateOneOnOneStatus(req.id, 'Contacted')}
                                className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-[10px] font-bold transition"
                                title="Mark Contacted"
                              >
                                Call
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: GENERAL CONTACT LOGS */}
        {/* ======================================================== */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> General Contact Logs
              </h3>
              <p className="text-xs text-textSecondary mt-1">Read messages submitted through the website Contact Us page.</p>
            </div>

            <div className="space-y-4">
              {contactList.length === 0 ? (
                <div className="bg-white border border-borderLight rounded-2xl p-12 text-center text-textSecondary space-y-2">
                  <Mail className="w-10 h-10 text-borderLight mx-auto" />
                  <p className="text-xs font-semibold">No contact inquiries found in database logs.</p>
                </div>
              ) : (
                contactList.map((msg) => (
                  <div key={msg.id} className="bg-white border border-borderLight p-6 rounded-2xl shadow-soft space-y-4 hover:border-primary/50 transition">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-sectionBg pb-3">
                      <div>
                        <h4 className="text-xs font-black text-textPrimary">{msg.name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-textSecondary mt-1">
                          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-borderLight" /> {msg.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-borderLight" /> {msg.phone}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-textSecondary bg-sectionBg px-2 py-0.5 rounded-full">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="font-extrabold text-primary flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Subject: {msg.subject}
                      </div>
                      <p className="text-textSecondary leading-relaxed bg-[#FAFAFC] p-3 rounded-xl border border-sectionBg select-all">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 11: WEBSITE SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Website & Configuration Settings
              </h3>
              <p className="text-xs text-textSecondary mt-1">Manage global branding, support channels, email SMTP configurations, and gateway API client key flags.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs text-textPrimary">
              
              {/* Branding Section */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-primary border-b border-borderLight pb-2">Website Branding</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Academy Logo Brand Title</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.logo}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, logo: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                </div>
              </div>

              {/* Support Hotline Section */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-secondary border-b border-borderLight pb-2">Support Hotlines & Channels</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Support Phone</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.contactPhone}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Support Email</label>
                    <input
                      type="email"
                      required
                      value={settingsForm.contactEmail}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">WhatsApp Hotline</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.contactWhatsapp}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, contactWhatsapp: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-textPrimary border-b border-borderLight pb-2">Social Channels References</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">LinkedIn URL</label>
                    <input
                      type="text"
                      value={settingsForm.socialLinkedin}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, socialLinkedin: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Twitter Handle URL</label>
                    <input
                      type="text"
                      value={settingsForm.socialTwitter}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, socialTwitter: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">YouTube Channel URL</label>
                    <input
                      type="text"
                      value={settingsForm.socialYoutube}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, socialYoutube: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                </div>
              </div>

              {/* Gateway keys */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-amber-500 border-b border-borderLight pb-2 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-amber-500" /> Gateway keys Client API Token Flags
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Mock Payment Key ID</label>
                    <input
                      type="text"
                      value={settingsForm.gatewayKeyId}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, gatewayKeyId: e.target.value }))}
                      className="glass-input font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Mock Payment Key Secret</label>
                    <input
                      type="password"
                      value={settingsForm.gatewayKeySecret}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, gatewayKeySecret: e.target.value }))}
                      className="glass-input font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-black hover:bg-primaryHover hover:shadow-glowPurple transition rounded-xl text-xs uppercase tracking-wider"
              >
                Save Settings Configuration
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
