const fs = require('fs');
const path = require('path');

// Register ts-node to parse TypeScript files
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    esModuleInterop: true
  }
});

// Import DB and PDF generator
const { db } = require('./src/lib/db');
const { generatePdfForCourse, getSyllabusFileName } = require('./src/lib/pdf-generator');

async function seed() {
  console.log('Starting brochure seeder...');
  
  // Make sure brochures folder exists
  const brochuresDir = path.join(process.cwd(), 'public', 'brochures');
  if (!fs.existsSync(brochuresDir)) {
    fs.mkdirSync(brochuresDir, { recursive: true });
  }

  // 1. Fetch all core courses
  console.log('Fetching core courses...');
  const courses = await db.course.findMany();
  console.log(`Found ${courses.length} core courses.`);

  for (const c of courses) {
    const courseData = {
      name: c.name,
      slug: c.slug,
      duration: c.duration,
      level: c.level,
      certificationBody: c.certificationBody || 'Aurenza Academy',
      description: c.description || '',
      courseHighlights: c.courseHighlights || '',
      syllabus: c.syllabus || '',
      mentorName: c.mentorName,
      mentorExp: c.mentorExp,
      mentorBio: c.mentorBio
    };

    const filename = getSyllabusFileName(courseData.name);
    const outputPath = path.join(brochuresDir, filename);

    console.log(`Generating brochure for: ${courseData.name} -> public/brochures/${filename}...`);
    try {
      await generatePdfForCourse(courseData, outputPath);
      
      // Update database path
      const brochurePath = `/brochures/${filename}`;
      if (c.brochure !== brochurePath) {
        await db.course.update({
          where: { id: c.id },
          data: { brochure: brochurePath }
        });
      }
    } catch (e) {
      console.error(`Failed to generate brochure for ${courseData.name}:`, e);
    }
  }

  // 2. Fetch all certification courses
  console.log('Fetching certification courses...');
  const certs = await db.certificationCourse.findMany({
    include: { category: true }
  });
  console.log(`Found ${certs.length} certification courses.`);

  for (const c of certs) {
    const courseData = {
      name: c.title,
      slug: c.slug,
      duration: c.duration,
      level: c.level,
      certificationBody: c.category?.name || c.certificationProvider || 'Professional Certification',
      description: c.shortDescription || `Master this dynamic ${c.title} certification program mapping directly to international industry guidelines.`,
      courseHighlights: JSON.stringify(['Weekend live interactive cohorts', 'Led by active technology directors', 'Direct recruitment referrals']),
      syllabus: JSON.stringify([
        { module: "Module 1: Introduction to " + c.title, details: "Overview of the core framework parameters, key terminology definitions, and organizational benefits of achieving certification." },
        { module: "Module 2: Core Concepts & Practice", details: "Deep dive into applying standard methodologies, worksheets, practical case studies, and corporate workflow exercises." },
        { module: "Module 3: Certification Preparation", details: "Detailed walkthrough of exam structure, specific syllabus weighting areas, and live reviews of mock exam question papers." }
      ]),
      mentorName: 'Alpesh Vasant',
      mentorExp: '15+ Years Experience',
      mentorBio: 'Executive Program Mentor and agile transformation director with extensive experience training over 5,000 corporate professionals globally.'
    };

    const filename = getSyllabusFileName(courseData.name);
    const outputPath = path.join(brochuresDir, filename);

    console.log(`Generating brochure for: ${courseData.name} -> public/brochures/${filename}...`);
    try {
      await generatePdfForCourse(courseData, outputPath);
    } catch (e) {
      console.error(`Failed to generate brochure for ${courseData.name}:`, e);
    }
  }

  console.log('Brochure seeder execution completed successfully!');
  await db.$disconnect();
}

seed().catch(err => {
  console.error('Fatal error in brochure seeder:', err);
  process.exit(1);
});
