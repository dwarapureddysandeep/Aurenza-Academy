import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  if (!password) return '';
  const salt = process.env.JWT_SECRET || 'aurenza_academy_secure_salt_98765';
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

function classifyCourseLevel(title: string): string {
  const t = title.toLowerCase();
  
  // Advanced
  if (
    t.includes('pgmp') ||
    t.includes('pfmp') ||
    t.includes('pmi-rmp') ||
    t.includes('pmi-sp') ||
    t.includes('rte') ||
    t.includes('spc') ||
    t.includes('practice consultant') ||
    t.includes('enterprise agile coach') ||
    t.includes('togaf advanced') ||
    t.includes('togaf enterprise architect') ||
    t.includes('cissp') ||
    t.includes('cism') ||
    t.includes('cisa') ||
    t.includes('ccsp') ||
    t.includes('advanced safe') ||
    t.includes('black belt') ||
    t.includes('advanced scrum') ||
    t.includes('a-csm') ||
    t.includes('a-cspo') ||
    t.includes('psm-a') ||
    t.includes('pspo-a') ||
    t.includes('psm ii') ||
    t.includes('pspo ii') ||
    t.includes('architect professional') ||
    t.includes('pmi-cpmai') ||
    t.includes('aspc') ||
    t.includes('advanced level security tester') ||
    t.includes('advanced level test manager') ||
    t.includes('agile product management') ||
    t.includes('lean portfolio management') ||
    t.includes('advanced scrum master')
  ) {
    return 'Advanced';
  }
  
  // Intermediate -> Advanced
  if (
    t.includes('pmp') ||
    t.includes('cbap') ||
    t.includes('ccba') ||
    t.includes('masters') ||
    t.includes("master's") ||
    t.includes('bootcamp') ||
    t.includes('architect associate') ||
    t.includes('solutions architect') || // AWS Solutions Architect
    t.includes('data science & ai') ||
    t.includes('full-stack') ||
    t.includes('full stack') ||
    t.includes('cybersecurity bootcamp') ||
    t.includes('ethical hacking')
  ) {
    return 'Intermediate -> Advanced';
  }
  
  // Beginner (checked BEFORE intermediate to catch "foundation", "fundamentals", "basics", etc.)
  if (
    t.includes('fundamentals') ||
    t.includes('foundation') ||
    t.includes('basic') ||
    t.includes('basics') ||
    t.includes('excel') ||
    t.includes('power bi fundamentals') ||
    t.includes('capm') ||
    t.includes('introduction') ||
    t.includes('intro') ||
    t.includes('essentials') ||
    t.includes('cloud practitioner') ||
    t.includes('yellow belt') ||
    t.includes('101') ||
    t.includes('get started') ||
    t.includes('start with')
  ) {
    return 'Beginner';
  }
  
  // Intermediate (catch-all for standard professional certifications)
  if (
    t.includes('pmi-acp') ||
    t.includes('prince2') ||
    t.includes('csm') ||
    t.includes('cspo') ||
    t.includes('scrummaster') ||
    t.includes('product owner') ||
    t.includes('popm') ||
    t.includes('fabric') ||
    t.includes('data engineering') ||
    t.includes('data engineer') ||
    t.includes('devops') ||
    t.includes('scrum master') ||
    t.includes('icp-acc') ||
    t.includes('practitioner') ||
    t.includes('administrator') ||
    t.includes('scrum developer') ||
    t.includes('associate') ||
    t.includes('green belt') ||
    t.includes('test analyst') ||
    t.includes('technical test analyst') ||
    t.includes('digital marketing') ||
    t.includes('financial modelling') ||
    t.includes('finance for non-finance') ||
    t.includes('auditing') ||
    t.includes('lead') ||
    t.includes('leader') ||
    t.includes('leadership') ||
    t.includes('coaching') ||
    t.includes('scrum') ||
    t.includes('testing') ||
    t.includes('ranorex') ||
    t.includes('testcomplete') ||
    t.includes('selenium') ||
    t.includes('development') ||
    t.includes('developer') ||
    t.includes('programming') ||
    t.includes('programmer') ||
    t.includes('database') ||
    t.includes('mongodb') ||
    t.includes('postgresql') ||
    t.includes('mysql') ||
    t.includes('neo4j') ||
    t.includes('mariadb') ||
    t.includes('redis') ||
    t.includes('hbase') ||
    t.includes('git') ||
    t.includes('github') ||
    t.includes('linux') ||
    t.includes('android') ||
    t.includes('ios') ||
    t.includes('react') ||
    t.includes('angular') ||
    t.includes('node') ||
    t.includes('javascript') ||
    t.includes('python') ||
    t.includes('c#') ||
    t.includes('scala') ||
    t.includes('ruby') ||
    t.includes('matlab') ||
    t.includes('sharepoint') ||
    t.includes('net') ||
    t.includes('asp') ||
    t.includes('php') ||
    t.includes('ui/ux') ||
    t.includes('ui-ux') ||
    t.includes('ux') ||
    t.includes('design') ||
    t.includes('blockchain') ||
    t.includes('big data') ||
    t.includes('hadoop') ||
    t.includes('spark') ||
    t.includes('kafka') ||
    t.includes('storm') ||
    t.includes('pig') ||
    t.includes('hive') ||
    t.includes('sales') ||
    t.includes('supply chain') ||
    t.includes('cpc') ||
    t.includes('cpma') ||
    t.includes('safe') ||
    t.includes('primavera')
  ) {
    return 'Intermediate';
  }
  
  // Fallbacks
  if (t.includes('architect') || t.includes('manager') || t.includes('leader') || t.includes('analyst') || t.includes('professional')) {
    return 'Intermediate';
  }
  
  return 'Beginner';
}

function cleanCourseTitle(title: string): string {
  let cleaned = title;
  
  // Replace double spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Handle specific known duplicates first
  cleaned = cleaned.replace(/Certification\s+Certification/gi, 'Certification');
  cleaned = cleaned.replace(/Certified\s+Certified/gi, 'Certified');
  cleaned = cleaned.replace(/Program\s+Program/gi, 'Program');
  cleaned = cleaned.replace(/Certification\s+Program\s+Certification/gi, 'Certification Program');
  cleaned = cleaned.replace(/Certification\s+Certification\s+Program/gi, 'Certification Program');
  
  // Replace exact repeated strings in titles
  cleaned = cleaned.replace(/Certified\s+Business\s+Analysis\s+Professional\s+\(CBAP\)\s+Certification/gi, 'Certified Business Analysis Professional (CBAP®)');
  cleaned = cleaned.replace(/Certified\s+Business\s+Analysis\s+Professional\s+\(CBAP®\)\s+Certification/gi, 'Certified Business Analysis Professional (CBAP®)');
  cleaned = cleaned.replace(/Certified\s+Business\s+Analysis\s+Professional™\s+\(CBAP®\)\s+Certification/gi, 'Certified Business Analysis Professional (CBAP®)');
  cleaned = cleaned.replace(/AWS\s+Cloud\s+Practitioner\s+Certification/gi, 'AWS Certified Cloud Practitioner');
  cleaned = cleaned.replace(/AWS\s+Certified\s+Cloud\s+Practitioner\s+Certification/gi, 'AWS Certified Cloud Practitioner');
  
  // Format specific certifications with proper registered symbols
  if (cleaned.match(/\bPMP\b/i) && !cleaned.includes('PMP®')) {
    cleaned = cleaned.replace(/\bPMP\b/gi, 'PMP®');
  }
  if (cleaned.match(/\bCBAP\b/i) && !cleaned.includes('CBAP®')) {
    cleaned = cleaned.replace(/\bCBAP\b/gi, 'CBAP®');
  }
  if (cleaned.match(/\bPMI-ACP\b/i) && !cleaned.includes('PMI-ACP®')) {
    cleaned = cleaned.replace(/\bPMI-ACP\b/gi, 'PMI-ACP®');
  }
  if (cleaned.match(/\bPgMP\b/i) && !cleaned.includes('PgMP®')) {
    cleaned = cleaned.replace(/\bPgMP\b/gi, 'PgMP®');
  }
  if (cleaned.match(/\bPfMP\b/i) && !cleaned.includes('PfMP®')) {
    cleaned = cleaned.replace(/\bPfMP\b/gi, 'PfMP®');
  }
  if (cleaned.match(/\bPRINCE2\b/i) && !cleaned.includes('PRINCE2®')) {
    cleaned = cleaned.replace(/\bPRINCE2\b/gi, 'PRINCE2®');
  }
  if (cleaned.match(/\bCAPM\b/i) && !cleaned.includes('CAPM®')) {
    cleaned = cleaned.replace(/\bCAPM\b/gi, 'CAPM®');
  }
  if (cleaned.match(/\bSAFe\b/i) && !cleaned.includes('SAFe®')) {
    cleaned = cleaned.replace(/\bSAFe\b/gi, 'SAFe®');
  }
  
  // Strip trailing "Certification" or "Certification Program" from names that shouldn't end with it,
  // or clean up trailing duplicates
  if (cleaned.endsWith(' Certification')) {
    if (cleaned.includes('PMP®')) cleaned = 'PMP® Certification';
    if (cleaned.includes('CBAP®')) cleaned = 'Certified Business Analysis Professional (CBAP®)';
  }

  // Clean trailing punctuation or double symbols
  cleaned = cleaned.replace(/®®/g, '®').replace(/™™/g, '™');
  // Clean double registered symbol after parenthesis: e.g. (PgMP®)® -> (PgMP®)
  cleaned = cleaned.replace(/\((PMP|CBAP|PgMP|PfMP|CAPM|PMI-ACP|SAFe|PRINCE2)®\)\s*®/gi, '($1®)');

  return cleaned.trim();
}

async function main() {
  console.log('[Seeder] Starting database seeding...');

  // 1. Clean Database
  console.log('[Seeder] Cleaning existing tables...');
  await prisma.review.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.batch.deleteMany({});
  await prisma.trainer.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.corporateLead.deleteMany({});
  await prisma.webinar.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Seed Default Accounts
  console.log('[Seeder] Seeding users...');
  const admin = await prisma.user.create({
    data: {
      id: "user-admin",
      name: "Aurenza Admin",
      email: "info@aurenzaacademy.com",
      password: hashPassword("Aurenza@0210"), // Securely hashed password
      phone: "+91 7013057827",
      role: "ADMIN",
      bio: "Executive Academy Administrator",
      avatar: "AA",
      permissions: ["leads", "courses", "testimonials", "company", "staff"],
    },
  });

  const student = await prisma.user.create({
    data: {
      id: "user-student",
      name: "Sandeep Kumar",
      email: "student@aurenzaacademy.com",
      password: hashPassword("student_pass"),
      phone: "+91 9876543210",
      role: "STUDENT",
      bio: "Aspiring Full Stack Engineer",
      avatar: "SK",
      permissions: [],
    },
  });

  const trainerUser = await prisma.user.create({
    data: {
      id: "user-trainer",
      name: "Dr. Ramesh Kumar",
      email: "trainer@aurenzaacademy.com",
      password: hashPassword("trainer_pass"),
      phone: "+91 9999988888",
      role: "TRAINER",
      bio: "Ex-Amazon Senior Java Architect",
      avatar: "RK",
      permissions: [],
    },
  });

  // 3. Seed Course Categories
  console.log('[Seeder] Seeding categories...');
  const pmCat = await prisma.category.create({ data: { id: "cat-1", name: "Project Management", slug: "project-management" } });
  const dsCat = await prisma.category.create({ data: { id: "cat-2", name: "Data Science", slug: "data-science" } });
  const aiCat = await prisma.category.create({ data: { id: "cat-3", name: "AI & Machine Learning", slug: "ai-machine-learning" } });
  const cloudCat = await prisma.category.create({ data: { id: "cat-4", name: "Cloud Computing", slug: "cloud" } });
  const devopsCat = await prisma.category.create({ data: { id: "cat-5", name: "DevOps", slug: "devops" } });
  const cyberCat = await prisma.category.create({ data: { id: "cat-6", name: "Cyber Security", slug: "cyber-security" } });
  const fsCat = await prisma.category.create({ data: { id: "cat-7", name: "Full Stack Development", slug: "full-stack" } });
  const mktCat = await prisma.category.create({ data: { id: "cat-8", name: "Digital Marketing", slug: "digital-marketing" } });
  const agileCat = await prisma.category.create({ data: { id: "cat-9", name: "Agile Management", slug: "agile-management" } });

  // 4. Seed Course Mentors / Trainers
  console.log('[Seeder] Seeding trainers...');
  const trainer1 = await prisma.trainer.create({
    data: {
      id: "trainer-1",
      name: "Dr. Ramesh Kumar",
      email: "trainer@aurenzaacademy.com",
      avatar: "RK",
      bio: "Ex-Amazon Senior Java Architect specializing in distributed web engineering.",
      specialty: "Java Full Stack & System Design",
    },
  });

  const trainer2 = await prisma.trainer.create({
    data: {
      id: "trainer-2",
      name: "Sarah D'Souza",
      email: "sarah@aurenzaacademy.com",
      avatar: "SD",
      bio: "UI Architect focused on rendering optimization and custom animations.",
      specialty: "React, Next.js, and CSS Systems",
    },
  });

  const trainerAlpesh = await prisma.trainer.create({
    data: {
      id: "trainer-alpesh",
      name: "Alpesh Vasant",
      email: "alpesh@aurenzaacademy.com",
      avatar: "AV",
      bio: "Certified ITIL Master Trainer with 10+ years of IT Service Management coaching.",
      specialty: "ITIL Frameworks",
    }
  });

  const trainerChad = await prisma.trainer.create({
    data: {
      id: "trainer-chad",
      name: "Chad Williams",
      email: "chad@aurenzaacademy.com",
      avatar: "CW",
      bio: "SPCT and Principal SAFe Consultant leading enterprise agility transformations.",
      specialty: "Agile & SAFe Frameworks",
    }
  });

  const trainerVisakh = await prisma.trainer.create({
    data: {
      id: "trainer-visakh",
      name: "Visakh R J",
      email: "visakh@aurenzaacademy.com",
      avatar: "VR",
      bio: "PMP Coach and Senior Project Management consultant with 12+ years experience.",
      specialty: "PMP & Project Management",
    }
  });

  const trainerSudipt = await prisma.trainer.create({
    data: {
      id: "trainer-sudipt",
      name: "Sudipt Singh",
      email: "sudipt@aurenzaacademy.com",
      avatar: "SS",
      bio: "Agile Delivery Director and PMP certification instructor.",
      specialty: "PMP & Agile Delivery",
    }
  });


  // 5. Seed Core Courses
  console.log('[Seeder] Seeding courses...');
  const courseJava = await prisma.course.create({
    data: {
      id: "course-java",
      name: "Java Full Stack Development",
      slug: "java-full-stack-development",
      categoryId: fsCat.id,
      duration: "6 months",
      level: "Beginner -> Advanced",
      price: 34999.0,
      rating: 4.8,
      reviewsCount: 342,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      mentorName: "Dr. Ramesh Kumar",
      mentorExp: "12+ Years Exp at Oracle & Amazon",
      mentorAvatar: "R",
      mentorBio: "Ex-Amazon Senior Engineer specializing in high-performance Java systems and distributed architecture.",
      syllabus: JSON.stringify([
        { module: "Module 1: Core Java Programming", details: "OOP principles, Collections Framework, Exception Handling, Multithreading & Stream API." },
        { module: "Module 2: Advanced Java & Database", details: "JDBC, MySQL foundations, Hibernate ORM, and database connection pools." },
        { module: "Module 3: Enterprise Spring Framework", details: "Spring Core, Spring Boot, Spring Data JPA, and RESTful Microservices." },
        { module: "Module 4: Frontend Integration", details: "HTML5, CSS3, JavaScript ES6, and connecting React frontends with Spring Boot." },
        { module: "Module 5: Testing, Security & Cloud", details: "JUnit testing, Spring Security, JWT, Docker, and AWS deployment." }
      ]),
      faqs: JSON.stringify([
        { q: "Are there any prerequisites for this course?", a: "No, this course starts completely from scratch. Basic programming familiarity is helpful but not mandatory." },
        { q: "Is there a placement assistance guarantee?", a: "Yes! We offer extensive mock interview sessions, resume polishing, and referrals with 500+ corporate hiring partners." }
      ]),
    },
  });

  const courseFrontend = await prisma.course.create({
    data: {
      id: "course-frontend",
      name: "Frontend Development (React & Next.js)",
      slug: "frontend-development-react-nextjs",
      categoryId: fsCat.id,
      duration: "4 months",
      level: "Beginner",
      price: 24999.0,
      rating: 4.9,
      reviewsCount: 289,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
      mentorName: "Sarah D'Souza",
      mentorExp: "8+ Years Exp at Adobe & Flipkart",
      mentorAvatar: "S",
      mentorBio: "UI Architect focused on rendering optimization, custom animations, Framer Motion, and design systems.",
      syllabus: JSON.stringify([
        { module: "Module 1: UI Core & Layouts", details: "Semantic HTML5, CSS Flexbox & Grid, Responsive Design, and Tailwind CSS." },
        { module: "Module 2: Modern JavaScript (ES6+)", details: "DOM manipulation, Asynchronous programming, Fetch API, and Functional structures." },
        { module: "Module 3: Deep React Foundations", details: "Virtual DOM, JSX, State & Props, Custom Hooks, Context API, and State Managers." },
        { module: "Module 4: Modern Production Next.js", details: "App Router, Server Actions, SSR vs SSG, Routing, SEO optimization, and Image components." }
      ]),
      faqs: JSON.stringify([
        { q: "Will I build real projects?", a: "Absolutely! You will build 6 real-world web applications including a premium e-commerce portal and a SaaS dashboard." }
      ]),
    },
  });

  const courseAI = await prisma.course.create({
    data: {
      id: "course-aiml",
      name: "AI & Machine Learning Engineering",
      slug: "ai-machine-learning-engineering",
      categoryId: aiCat.id,
      duration: "5 months",
      level: "Intermediate",
      price: 44999.0,
      rating: 4.9,
      reviewsCount: 198,
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      mentorName: "Dr. Vivek Sharma",
      mentorExp: "Ph.D. in AI, ex-Google Brain Scientist",
      mentorAvatar: "V",
      mentorBio: "Researcher focused on NLP transformer models, generative architectures, and scaling neural network computing parameters.",
      syllabus: JSON.stringify([
        { module: "Module 1: Mathematical Foundations", details: "Calculus optimization, Gradient Descent, Vector Calculus, and Probability." },
        { module: "Module 2: Deep Learning & Neural Networks", details: "Perceptrons, Backpropagation, MLP, and TensorFlow/PyTorch ecosystems." },
        { module: "Module 3: Computer Vision (CV)", details: "CNNs, Image Segmentation, OpenCV, YOLO model object detection." },
        { module: "Module 4: Natural Language Processing (NLP)", details: "LSTMs, Transformers, Attention mechanism, HuggingFace transformers, and LLM fine-tuning." }
      ]),
      faqs: JSON.stringify([
        { q: "Can I do this course part-time?", a: "Yes! All lectures are live-streamed on weekends and recorded in 4K resolution for asynchronous self-paced review." }
      ]),
    },
  });

  const courseAspc = await prisma.course.create({
    data: {
      id: "course-aspc",
      name: "Advanced SAFe Practice Consultant (ASPC) Certification",
      slug: "advanced-safe-practice-consultant-aspc-certification",
      categoryId: agileCat.id,
      duration: "4 days",
      level: "Advanced",
      price: 59999.0,
      rating: 4.9,
      reviewsCount: 120,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      mentorName: "Chad Williams",
      mentorExp: "15+ Years Exp in Agile & SAFe Consulting",
      mentorAvatar: "CW",
      mentorBio: "SPCT and Principal SAFe Consultant leading enterprise agility transformations.",
      syllabus: JSON.stringify([
        { module: "Module 1: Advanced SAFe Principles", details: "Deep dive into SAFe Lean-Agile mindset, SPCT pathways, and value streams." }
      ]),
      faqs: JSON.stringify([
        { q: "Is the exam fee included?", a: "Yes, the first exam attempt fee is included in the course price." }
      ])
    }
  });

  console.log('[Seeder] Seeding generated courses...');
  const generatedCourses = require('../src/lib/generated_array.json');
  for (const course of generatedCourses) {
    await prisma.course.create({
      data: {
        id: course.id,
        name: course.name,
        slug: course.slug,
        categoryId: course.categoryId,
        duration: course.duration,
        level: course.level,
        price: parseFloat(course.price) || 0.0,
        rating: parseFloat(course.rating) || 5.0,
        reviewsCount: parseInt(course.reviewsCount) || 0,
        image: course.image,
        mentorName: course.mentorName,
        mentorExp: course.mentorExp,
        mentorAvatar: course.mentorAvatar,
        mentorBio: course.mentorBio,
        syllabus: typeof course.syllabus === 'string' ? course.syllabus : JSON.stringify(course.syllabus || []),
        faqs: typeof course.faqs === 'string' ? course.faqs : JSON.stringify(course.faqs || [])
      }
    });
  }

  // 6. Seed Cohorts / Batches
  console.log('[Seeder] Seeding cohorts...');
  await prisma.batch.create({
    data: {
      id: "batch-itil-1",
      courseId: "course-itil-foundation-certification",
      trainerId: "trainer-alpesh",
      startDate: "June 20, 2026",
      endDate: "June 28, 2026",
      timeZone: "IST",
      timeSlot: "12:30 PM - 04:30 PM IST",
      seatsTotal: 30,
      seatsLeft: 30,
      linkZoom: "https://zoom.us/j/mock-itil-meeting",
      batchType: "Weekend Batch",
      trainingMode: "Online Classroom",
      status: "Upcoming"
    },
  });

  await prisma.batch.create({
    data: {
      id: "batch-aspc-1",
      courseId: "course-aspc",
      trainerId: "trainer-chad",
      startDate: "June 22, 2026",
      endDate: "June 25, 2026",
      timeZone: "IST",
      timeSlot: "05:30 PM - 01:30 AM IST",
      seatsTotal: 30,
      seatsLeft: 30,
      linkZoom: "https://zoom.us/j/mock-aspc-meeting",
      batchType: "Weekday Batch",
      trainingMode: "Online Classroom",
      status: "Upcoming"
    },
  });

  await prisma.batch.create({
    data: {
      id: "batch-pmp-1",
      courseId: "course-pmp",
      trainerId: "trainer-visakh",
      startDate: "June 27, 2026",
      endDate: "July 26, 2026",
      timeZone: "IST",
      timeSlot: "07:30 PM - 12:00 AM IST",
      seatsTotal: 30,
      seatsLeft: 30,
      linkZoom: "https://zoom.us/j/mock-pmp1-meeting",
      batchType: "Weekend Batch",
      trainingMode: "Online Classroom",
      status: "Upcoming"
    },
  });

  await prisma.batch.create({
    data: {
      id: "batch-pmp-2",
      courseId: "course-pmp",
      trainerId: "trainer-visakh",
      startDate: "June 29, 2026",
      endDate: "July 23, 2026",
      timeZone: "IST",
      timeSlot: "06:00 AM - 08:20 AM IST",
      seatsTotal: 30,
      seatsLeft: 30,
      linkZoom: "https://zoom.us/j/mock-pmp2-meeting",
      batchType: "Weekday Batch",
      trainingMode: "Online Classroom",
      status: "Upcoming"
    },
  });

  await prisma.batch.create({
    data: {
      id: "batch-pmp-3",
      courseId: "course-pmp",
      trainerId: "trainer-visakh",
      startDate: "July 06, 2026",
      endDate: "July 30, 2026",
      timeZone: "IST",
      timeSlot: "07:30 PM - 09:30 PM IST",
      seatsTotal: 30,
      seatsLeft: 30,
      linkZoom: "https://zoom.us/j/mock-pmp3-meeting",
      batchType: "Weekday Batch",
      trainingMode: "Online Classroom",
      status: "Upcoming"
    },
  });

  await prisma.batch.create({
    data: {
      id: "batch-pmp-4",
      courseId: "course-pmp",
      trainerId: "trainer-visakh",
      startDate: "July 11, 2026",
      endDate: "August 09, 2026",
      timeZone: "IST",
      timeSlot: "07:00 AM - 11:30 AM IST",
      seatsTotal: 30,
      seatsLeft: 30,
      linkZoom: "https://zoom.us/j/mock-pmp4-meeting",
      batchType: "Weekend Batch",
      trainingMode: "Online Classroom",
      status: "Upcoming"
    },
  });

  await prisma.batch.create({
    data: {
      id: "batch-pmp-5",
      courseId: "course-pmp",
      trainerId: "trainer-sudipt",
      startDate: "July 18, 2026",
      endDate: "August 16, 2026",
      timeZone: "IST",
      timeSlot: "07:30 PM - 12:00 AM IST",
      seatsTotal: 30,
      seatsLeft: 30,
      linkZoom: "https://zoom.us/j/mock-pmp5-meeting",
      batchType: "Weekend Batch",
      trainingMode: "Online Classroom",
      status: "Upcoming"
    },
  });

  await prisma.batch.create({
    data: {
      id: "batch-pmp-6",
      courseId: "course-pmp",
      trainerId: "trainer-visakh",
      startDate: "July 27, 2026",
      endDate: "August 28, 2026",
      timeZone: "IST",
      timeSlot: "01:30 PM - 05:30 PM IST",
      seatsTotal: 30,
      seatsLeft: 30,
      linkZoom: "https://zoom.us/j/mock-pmp6-meeting",
      batchType: "Weekday Batch",
      trainingMode: "Online Classroom",
      status: "Upcoming"
    },
  });

  // 7. Seed Enrollments & Payments
  console.log('[Seeder] Seeding enrollments...');
  await prisma.enrollment.create({
    data: {
      id: "enr-1",
      userId: student.id,
      courseId: courseFrontend.id,
      progress: 65,
      lastLesson: "Module 3: React Custom Hooks",
    },
  });

  await prisma.payment.create({
    data: {
      id: "pay-1",
      userId: student.id,
      courseId: courseFrontend.id,
      amount: 24999.0,
      status: "Success",
      txId: "TXN-MOCK-FED8237",
    },
  });

  // 8. Seed Leads
  console.log('[Seeder] Seeding crm leads...');
  await prisma.lead.create({
    data: {
      id: "lead-1",
      name: "Aarav Mehta",
      email: "aarav.mehta@gmail.com",
      phone: "+91 9123456789",
      course: "Java Full Stack Development",
      message: "Interested in evening weekend cohorts",
      status: "NEW",
      notes: "",
    },
  });

  await prisma.lead.create({
    data: {
      id: "lead-2",
      name: "Esha Gupta",
      email: "esha.gupta@yahoo.com",
      phone: "+91 8234567890",
      course: "AI & Machine Learning Engineering",
      message: "Looking for scholarship opportunities",
      status: "CONTACTED",
      notes: "Called today, interested in AI course syllabus.",
    },
  });

  // 9. Seed Webinars
  console.log('[Seeder] Seeding webinars...');
  await prisma.webinar.create({
    data: {
      id: "webinar-1",
      title: "Mastering Generative AI & Large Language Models",
      description: "Learn how to build and fine-tune enterprise LLMs from scratch.",
      speaker: "Dr. Vivek Sharma",
      date: "June 05, 2026",
      time: "6:00 PM IST",
      link: "https://zoom.us/j/mock-webinar-ai",
      registrationsCount: 142,
      status: "Upcoming",
    },
  });

  // 10. Seed Blogs
  console.log('[Seeder] Seeding blogs...');
  await prisma.blog.create({
    data: {
      id: "blog-1",
      title: "The Ultimate Next.js 15 App Router Migration Guide",
      slug: "nextjs-15-migration-guide",
      content: "Next.js 15 introduces dynamic improvements for server actions, styling caches, and compiling speeds. In this guide, we dive deep into how full-stack architects can upgrade existing apps seamlessly.",
      category: "Software Development",
      authorId: admin.id,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      tags: ["Next.js", "React 19", "Web Development"],
      views: 310,
    },
  });

  // 11. Seed Testimonials & Certificates
  console.log('[Seeder] Seeding testimonials & certificates...');
  await prisma.testimonial.create({
    data: {
      id: "test-1",
      name: "Ananya Sharma",
      role: "Software Engineer at Microsoft",
      quote: "Got placed at Microsoft with 18 LPA. The intensive roadmap and 1-on-1 industry mock reviews completely changed my trajectory.",
      rating: 5,
      featured: true,
      initial: "A",
    },
  });

  await prisma.testimonial.create({
    data: {
      id: "test-2",
      name: "Rohit Verma",
      role: "Data Scientist at Amazon",
      quote: "Highly structure-driven syllabus. I came from a non-CS engineering background, and within 6 months, pivoted into data engineering.",
      rating: 5,
      featured: true,
      initial: "R",
    },
  });

  await prisma.certificate.create({
    data: {
      id: "cert-1",
      userId: student.id,
      courseId: courseFrontend.id,
      name: "Sandeep Kumar",
      courseName: "Frontend Development (React & Next.js)",
      completionDate: "May 20, 2026",
      certId: "AUR-FED-2026-0047",
    },
  });

  // 12. Seed FAQs
  console.log('[Seeder] Seeding general FAQs...');
  const faqs = [
    { id: "faq-1", question: "What is the training format?", answer: "The courses are delivered through live virtual interactive weekend workshops with 24/7 slack channel mentorship.", order: 1 },
    { id: "faq-2", question: "Will I receive placement assistance?", answer: "Yes, we have over 500+ recruitment partners and offer career counseling, resume optimization, and mock interview setups.", order: 2 },
    { id: "faq-3", question: "Are the course materials lifetime accessible?", answer: "Absolutely. All students receive lifetime credentials for class recordings, sandbox labs, and syllabus documents.", order: 3 }
  ];
  for (const faq of faqs) {
    await prisma.faq.upsert({
      where: { id: faq.id },
      update: faq,
      create: faq
    });
  }

  // 13. Seed Homepage Content
  console.log('[Seeder] Seeding homepage CMS content...');
  const cmsEntries = [
    { id: "cms-1", section: "hero", key: "title", value: "Advance Your Career With Industry Recognized Certifications" },
    { id: "cms-2", section: "hero", key: "subtitle", value: "Learn from industry experts through live instructor-led training programs." },
    { id: "cms-3", section: "hero", key: "cta-primary", value: "Explore Courses" },
    { id: "cms-4", section: "hero", key: "cta-secondary", value: "Book Free Consultation" },
    { id: "cms-5", section: "hero", key: "stats-learners", value: "5000" },
    { id: "cms-6", section: "hero", key: "stats-courses", value: "100" },
    { id: "cms-7", section: "hero", key: "stats-trainers", value: "50" }
  ];
  for (const entry of cmsEntries) {
    await prisma.homepageContent.upsert({
      where: { section_key: { section: entry.section, key: entry.key } },
      update: { value: entry.value },
      create: entry
    });
  }

  // 14. Seed Certification Categories and Courses
  console.log('[Seeder] Seeding certification categories and courses...');
  const certCategories = [
    {
      name: "Agile Management",
      slug: "agile-management",
      description: "CSM, CSPO, A-CSM, and SAFe certifications to scale team delivery.",
      icon: "Zap",
      displayOrder: 0,
      courses: [
        "Certified ScrumMaster (CSM)®",
        "CSPO® Certification",
        "Gen AI for Scrum Masters",
        "Generative AI Course for POPM",
        "Leading SAFe® 6.0 Certification",
        "Generative AI Course for Project Managers",
        "Implementing SAFe® 6.0 with SPC Certification",
        "SAFe® 6.0 Product Owner/Product Manager (POPM)",
        "SAFe® 6.0 SSM Certification",
        "SAFe® 6 Release Train Engineer (RTE) Certification",
        "Professional Scrum Product Owner™ (PSPO)",
        "ICP Agile Certified Coaching (ICP-ACC)",
        "Advanced Certified ScrumMaster (A-CSM®)",
        "Advanced Certified Scrum Product Owner℠ (A-CSPO℠)",
        "Professional Scrum Master™ I (PSM I) Training"
      ]
    },
    {
      name: "Project Management",
      slug: "project-management",
      description: "PMP, PRINCE2, and CAPM pathways for delivery leaders.",
      icon: "Briefcase",
      displayOrder: 1,
      courses: [
        "PMP® Certification",
        "PRINCE2® Foundation and Practitioner",
        "PMI Certified Professional in Managing AI (PMI-CPMAI)™ Certification Course",
        "PRINCE2® Foundation Course",
        "Project Management Techniques",
        "CAPM® Certification",
        "Program Management Professional (PgMP)® Certification",
        "PRINCE2® Practitioner",
        "PRINCE2 Agile® Foundation Certification",
        "Project Management Masters Certification Program",
        "PfMP® Certification",
        "PRINCE2 Agile® Practitioner Certification",
        "Microsoft® Project 2013",
        "Oracle Primavera Training",
        "Microsoft Project 2007/2010"
      ]
    },
    {
      name: "Data Science & AI",
      slug: "data-science-ai",
      description: "Executive and engineering tracks in Gen AI, Agentic AI, and Machine Learning.",
      icon: "Cpu",
      displayOrder: 2,
      courses: [
        "Applied Agentic AI Certification",
        "AI-Powered Product Management Course",
        "Generative AI Masters Program",
        "Microsoft Vibe Coding",
        "Advanced AI Masters",
        "Python for AI Engineers",
        "Enterprise AI Platforms with AWS, Azure & Google Cloud",
        "Generative AI & Agentic AI Master Program",
        "Generative AI Foundations Certificate Program",
        "Generative AI Mastery Certificate for Data Analysis",
        "Generative AI and Prompt Engineering for Professionals",
        "Data Analytics with Power BI using AI",
        "ML Solutions Using Azure Databricks (DP-3014)",
        "Microsoft Certified: Fabric Data Engineer Associate (DP-700)"
      ]
    },
    {
      name: "Cloud Computing",
      slug: "cloud-computing",
      description: "AWS, Azure, and Google Cloud architect and essentials programs.",
      icon: "Cloud",
      displayOrder: 3,
      courses: [
        "AWS Certified Solutions Architect – Associate Training",
        "Azure Solution Architect Certification (AZ-305)",
        "AWS Cloud Architect Masters Program Certification",
        "The Machine Learning Pipeline on AWS Training",
        "Cloud Engineer Bootcamp",
        "Planning and Designing Databases on AWS Certification",
        "Developing on AWS",
        "Deep Learning on AWS Training",
        "AWS Technical Essentials",
        "AWS Cloud Practitioner Essentials Certification Training",
        "Security Engineering on AWS Certification Training",
        "Azure Data Engineer Master's Program",
        "Architecting on AWS Accelerator Certification",
        "Data Warehousing on AWS Training",
        "Microsoft Azure Fundamentals"
      ]
    },
    {
      name: "Web Development",
      slug: "web-development",
      description: "Full Stack, Frontend, Backend, UI/UX bootcamps and technologies.",
      icon: "Code",
      displayOrder: 4,
      courses: [
        "Generative AI Mastery Certificate for Software Development",
        "Full-Stack Development Bootcamp",
        "Front-End Development Bootcamp",
        "Back-End Development Bootcamp",
        "Full-Stack Developer Bootcamp [Java]",
        "React JS Training",
        "Node.js",
        "Angular",
        "JavaScript",
        "UI/UX Design",
        "UI-UX Bootcamp",
        "Java/J2EE and SOA",
        "MEAN Stack Development",
        "Microsoft SharePoint 2013",
        "PHP and MySQL"
      ]
    },
    {
      name: "DevOps",
      slug: "devops",
      description: "Docker, Kubernetes, Ansible, and continuous delivery pipelines.",
      icon: "Activity",
      displayOrder: 5,
      courses: [
        "Get Started with DevOps Course with Certification",
        "Docker and Kubernetes",
        "DevOps",
        "Kubernetes",
        "Certified Kubernetes Administrator Certification Training",
        "DevOps Foundation® Certification",
        "Docker",
        "DevOps Leader (DOL)®",
        "Ansible",
        "OpenStack",
        "Chef",
        "Puppet",
        "Project-Based DevOps Bootcamp",
        "Continuous Delivery Ecosystem Foundation (CDEF)℠",
        "DevSecOps Foundation (DSOF)℠"
      ]
    },
    {
      name: "IT Security",
      slug: "it-security",
      description: "Ethical Hacking, CISA, CISSP, and cybersecurity master programs.",
      icon: "Shield",
      displayOrder: 6,
      courses: [
        "Certified Ethical Hacking Course (CEH® v13)",
        "CISA®",
        "CISM®",
        "Cybersecurity Master's Program",
        "CISSP®",
        "COBIT® 5 Foundation",
        "PCI - Data Security Standard",
        "Microsoft Security, Compliance, and Identity Fundamentals Certification",
        "CCSP Certification Training",
        "CyberSAFE Certification",
        "Cybersecurity Certificate Program - Purdue",
        "CIPP/E Certification Training"
      ]
    },
    {
      name: "Business Management",
      slug: "business-management",
      description: "CBAP, ECBA, Business Analytics, and growth strategies.",
      icon: "LineChart",
      displayOrder: 7,
      courses: [
        "Certified Business Analysis Professional™ (CBAP®) Certification",
        "Entry Certificate in Business Analysis™ (ECBA™)",
        "Gen AI Course for Business Analysts",
        "Generative AI Mastery Certificate for Managerial Excellence",
        "Professional Certificate Program in Business Analytics & Consulting",
        "Business Growth Strategies",
        "Agile Business Analysis",
        "CCBA® Prep Course",
        "PMI-PBA® Certification",
        "Business Case Writing",
        "IREB Certified Professional for Requirements Engineering"
      ]
    },
    {
      name: "Quality Management",
      slug: "quality-management",
      description: "Lean Six Sigma, CMMI, and Quality control certifications.",
      icon: "CheckSquare",
      displayOrder: 8,
      courses: [
        "Lean Six Sigma Green Belt Certification",
        "Lean Six Sigma Black Belt Certification",
        "Lean Six Sigma Yellow Belt Certification",
        "CMMI® V1.3",
        "TÜV SÜD Six Sigma Green Belt Certification Training",
        "TÜV SÜD Six Sigma Black Belt Certification Training"
      ]
    },
    {
      name: "IT Service Management",
      slug: "it-service-management",
      description: "ITIL foundation, specialist, and transition frameworks.",
      icon: "Award",
      displayOrder: 9,
      courses: [
        "ITIL 5 Foundation Certification Training",
        "ITIL® 4 Foundation",
        "ITIL Foundation Bridge (V5) For ITIL 4 Certified Professionals",
        "ITIL® Practitioner",
        "ITIL® 4 Strategist Direct, Plan and Improve",
        "ITIL® 4 Specialist: Create, Deliver and Support Training",
        "ITIL® 4 Specialist: Drive Stakeholder Value Training",
        "ISO 20000 Certification Course",
        "ISO 27000 Foundation Certification Course",
        "ISO 14001 Foundation Certification Course",
        "ITIL® 4 Managing Professional Transition Module"
      ]
    },
    {
      name: "Programming",
      slug: "programming",
      description: "Full stack programming, scripting languages, and GIT systems.",
      icon: "Terminal",
      displayOrder: 10,
      courses: [
        "AI-Powered Software Development",
        "GIT and GitHub Essentials",
        "Linux Essentials Certification",
        "R Programming Language Certification",
        "C#",
        "Ruby 101",
        "Python Programming",
        "Scala",
        "Microsoft .NET Framework",
        "ASP.NET",
        "MATLAB",
        "Advanced Python Course",
        "Advanced R Course",
        "Advanced Scala",
        "Ruby Deep Dive"
      ]
    },
    {
      name: "BI and Visualization",
      slug: "bi-visualization",
      description: "Power BI, Spotfire, QlikView, and business intelligence systems.",
      icon: "BarChart3",
      displayOrder: 11,
      courses: [
        "Microsoft Power BI",
        "TIBCO Spotfire",
        "Data Visualization with QlikView",
        "Sisense BI"
      ]
    },
    {
      name: "Blockchain",
      slug: "blockchain",
      description: "Blockchain security, architecture, and quality engineering.",
      icon: "Globe",
      displayOrder: 12,
      courses: [
        "Blockchain 101 Certification",
        "Blockchain Security Training",
        "Blockchain for Solutions Architect",
        "Certified Blockchain Professional (CBCP)",
        "Blockchain Quality Engineer Certification Training"
      ]
    },
    {
      name: "Big Data",
      slug: "big-data",
      description: "Hadoop administration, Spark, Storm, Kafka, and big data analysis.",
      icon: "Database",
      displayOrder: 13,
      courses: [
        "Apache Storm",
        "Apache Spark and Scala",
        "Apache Kafka",
        "Comprehensive Pig",
        "Comprehensive Hive",
        "Hadoop Administration Course",
        "Big Data and Hadoop Course",
        "Big Data Analytics Course"
      ]
    },
    {
      name: "Mobile App Development",
      slug: "mobile-app-development",
      description: "Android, iOS, React Native, Xamarin, and cross-platform systems.",
      icon: "Smartphone",
      displayOrder: 14,
      courses: [
        "Ionic",
        "Xamarin Studio",
        "Xamarin Certification",
        "OpenGL",
        "NativeScript for Mobile App Development",
        "Android Development",
        "iOS Development",
        "React Native",
        ".NET MAUI for Xamarin Developers Course",
        ".NET MAUI for C# Developers Course"
      ]
    },
    {
      name: "Software Testing",
      slug: "software-testing",
      description: "ISTQB tester pathways, Selenium automation, and Ranorex frameworks.",
      icon: "CheckSquare",
      displayOrder: 15,
      courses: [
        "Coded UI Test using Microsoft Visual Studio 2013",
        "ISTQB Foundation Level 2018 Training",
        "Selenium Essentials",
        "Teradata",
        "Concordion",
        "ISTQB Certified Advanced Level Security Tester",
        "Cucumber",
        "Silk Test Workbench",
        "Automation Testing using TestComplete",
        "ISTQB Certified Advanced Level Test Manager",
        "Functional Testing Using Ranorex",
        "ISTQB Certified Advanced Level Test Analyst",
        "ISTQB Advanced Level Technical Test Analyst"
      ]
    },
    {
      name: "Digital Marketing",
      slug: "digital-marketing",
      description: "Funnel ads, organic marketing, email, paid campaigns, and SEO.",
      icon: "Megaphone",
      displayOrder: 16,
      courses: [
        "Generative AI Mastery Certificate for Content Creation",
        "AI-Driven Digital Marketing: Funnels, Ads, Content & KPIs",
        "Digital Marketing Essentials",
        "Segmentation, Targeting & Positioning (STP)",
        "Data-driven Marketing",
        "Organic Digital Marketing",
        "Paid Digital Marketing",
        "Content Marketing",
        "Conversion Optimization",
        "Digital Marketing",
        "The Complete Google Ads Masterclass",
        "Display Advertising",
        "E-mail Marketing",
        "Mobile Marketing",
        "Pay Per Click Advertising"
      ]
    },
    {
      name: "Risk Management",
      slug: "risk-management",
      description: "FRM credentials, internal controls, GDPR, and data protection.",
      icon: "AlertTriangle",
      displayOrder: 17,
      courses: [
        "FRM Level 1 Certification",
        "FRM Level 2 Certification",
        "Risk Management and Internal Controls",
        "Introduction to the European Union General Data Protection Regulation",
        "Data Protection Associate"
      ]
    },
    {
      name: "Finance",
      slug: "finance",
      description: "Financial modeling, auditing, IFRS reporting, and budgeting.",
      icon: "DollarSign",
      displayOrder: 18,
      courses: [
        "Professional Certificate Program in Financial Modelling and Analysis (PwC Academy)",
        "Auditing and Assurance Training",
        "Budget Analysis and Forecasting",
        "Certificate in International Financial Reporting",
        "Corporate Governance",
        "Credit Risk Management",
        "Diploma in International Financial Reporting",
        "Finance for Non-Finance Managers",
        "Financial Modeling with Excel",
        "IFRS for SMEs"
      ]
    },
    {
      name: "Database",
      slug: "database",
      description: "PostgreSQL, MongoDB, Neo4J, Redis, MariaDB, and database design.",
      icon: "Database",
      displayOrder: 19,
      courses: [
        "MongoDB Administrator",
        "PostgreSQL Training: Fundamentals to Advanced",
        "Master Neo4J Graph Database",
        "MariaDB For Developers",
        "HBase",
        "MySQL",
        "Redis",
        "MySQL with Hibernate"
      ]
    },
    {
      name: "Soft Skill Training",
      slug: "soft-skill-training",
      description: "Leadership management, corporate career growth, and emotional intelligence.",
      icon: "Users",
      displayOrder: 20,
      courses: [
        "Tech Sales Excellence Bootcamp",
        "Leadership for Managers Program",
        "Attributes of a Leader",
        "Building Team Trust Workshop",
        "Communication Skills Mastery",
        "International Certificate In Advanced Leadership Skills",
        "Soft Skills - Communication",
        "Soft Skills Leadership",
        "Soft Skills for Corporate Career Growth",
        "Communication Skills Intensive",
        "Conflict Management",
        "Communication",
        "Emotional Intelligence",
        "Stress Management Training",
        "Presentation Skills Training"
      ]
    },
    {
      name: "CompTIA",
      slug: "comptia",
      description: "CompTIA A+, Network+, Security+, Cloud+, and Server+ certifications.",
      icon: "Cpu",
      displayOrder: 21,
      courses: [
        "CompTIA A+ Certification",
        "CompTIA Cloud Essentials Certification",
        "CompTIA Cloud+ Certification",
        "CompTIA Mobility+ Certification",
        "CompTIA Network+ Certification",
        "CompTIA Security+ Certification",
        "CompTIA Server+ Certification",
        "CompTIA Project+ Certification"
      ]
    },
    {
      name: "Others",
      slug: "others",
      description: "IELTS preparation, Supply chain, and custom bootcamps.",
      icon: "Sparkles",
      displayOrder: 22,
      courses: [
        "IELTS Preparation Training Course",
        "AI-Powered Supply Chain Management Certification",
        "Software Engineering Bootcamp - JS",
        "AI-Powered Full-Stack Executive Certification Training",
        "Cybersecurity Bootcamp",
        "Ethical Hacking Mastery Course",
        "Microsoft Azure AI Engineer Associate Customized Training",
        "Certified Supply Chain Professional",
        "Microsoft Excel",
        "Advanced Excel 2021",
        "Flow Measurement and Custody Transfer Course",
        "Foundation Certificate in Marketing",
        "Leading and Delivering World Class Product Development Course",
        "Product Management and Product Marketing for Telecoms, IT and Software",
        "Software Estimation and Measurement Using IFPUG FPA"
      ]
    },
    {
      name: "Medical Coding",
      slug: "medical-coding",
      description: "CPC and CPMA credential pathways for medical billing and coding.",
      icon: "Activity",
      displayOrder: 23,
      courses: [
        "Certified Professional Coder (CPC) Certification",
        "CPMA"
      ]
    }
  ];

  for (const cat of certCategories) {
    const dbCat = await prisma.certificationCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon, displayOrder: cat.displayOrder },
      create: { name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon, displayOrder: cat.displayOrder }
    });

    let displayOrder = 0;
    for (const courseTitle of cat.courses) {
      const cleanTitleForSlug = courseTitle.replace(/[®™]/g, '');
      const courseSlug = cleanTitleForSlug.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      const provider = courseTitle.includes('AWS') ? 'AWS' :
                       courseTitle.includes('Azure') || courseTitle.includes('Fabric') || courseTitle.includes('Microsoft') ? 'Microsoft' :
                       courseTitle.includes('ScrumMaster') || courseTitle.includes('CSM') || courseTitle.includes('CSPO') || courseTitle.includes('Scrum') ? 'Scrum Alliance' :
                       courseTitle.includes('SAFe') ? 'Scaled Agile' :
                       courseTitle.includes('PRINCE2') ? 'AXELOS' :
                       courseTitle.includes('PMP') || courseTitle.includes('CAPM') || courseTitle.includes('PgMP') || courseTitle.includes('PfMP') || courseTitle.includes('PMI') ? 'PMI' :
                       courseTitle.includes('IIT') || courseTitle.includes('Kharagpur') ? 'IIT Kharagpur' : 'Aurenza Academy';

      const standardizedTitle = cleanCourseTitle(courseTitle);
      const standardizedLevel = classifyCourseLevel(standardizedTitle);

      await prisma.certificationCourse.upsert({
        where: { slug: courseSlug },
        update: {
          title: standardizedTitle,
          categoryId: dbCat.id,
          displayOrder: displayOrder,
          level: standardizedLevel,
        },
        create: {
          categoryId: dbCat.id,
          title: standardizedTitle,
          slug: courseSlug,
          shortDescription: `Master ${standardizedTitle} skills with live interactive cohort sessions.`,
          duration: courseTitle.includes('Bootcamp') || courseTitle.includes('Program') || courseTitle.includes('Masters') ? '3-6 months' : '4-8 weeks',
          level: standardizedLevel,
          certificationProvider: provider,
          image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80`,
          displayOrder: displayOrder,
          isActive: true
        }
      });
      displayOrder++;
    }
  }

  console.log('[Seeder] Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('[Seeder] Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
