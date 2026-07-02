import { db } from './src/lib/db';
import { generatePdfBuffer, getSyllabusFileName } from './src/lib/pdf-generator';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('--- STARTING BROCHURE PRE-GENERATION ---');
  
  const brochuresDir = path.join(process.cwd(), 'public', 'brochures');
  if (!fs.existsSync(brochuresDir)) {
    fs.mkdirSync(brochuresDir, { recursive: true });
  }

  // 1. Fetch all courses
  console.log('Fetching courses from Course table...');
  const dbCourses = await db.course.findMany();
  
  console.log('Fetching courses from CertificationCourse table...');
  const certCourses = await db.certificationCourse.findMany({
    include: { category: true }
  });

  console.log(`Found ${dbCourses.length} core courses and ${certCourses.length} certification courses.`);

  const allCourses: any[] = [];
  const processedSlugs = new Set<string>();

  // Add core courses first
  dbCourses.forEach(c => {
    if (!processedSlugs.has(c.slug)) {
      processedSlugs.add(c.slug);
      allCourses.push({
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
        mentorBio: c.mentorBio,
        source: 'Course Table'
      });
    }
  });

  // Add certification courses (fallback mapping)
  certCourses.forEach(c => {
    if (!processedSlugs.has(c.slug)) {
      processedSlugs.add(c.slug);
      allCourses.push({
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
        mentorBio: 'Executive Program Mentor and agile transformation director with extensive experience training over 5,000 corporate professionals globally.',
        source: 'CertificationCourse Table'
      });
    }
  });

  console.log(`Total unique brochures to generate: ${allCourses.length}`);
  
  let successCount = 0;
  let failCount = 0;
  const reportEntries: any[] = [];

  for (let i = 0; i < allCourses.length; i++) {
    const course = allCourses[i];
    const filename = getSyllabusFileName(course.name);
    const destPath = path.join(brochuresDir, filename);

    try {
      // console.log(`[${i+1}/${allCourses.length}] Generating ${filename}...`);
      const pdfBuffer = await generatePdfBuffer(course);
      fs.writeFileSync(destPath, pdfBuffer);
      successCount++;
      reportEntries.push({
        title: course.name,
        slug: course.slug,
        level: course.level,
        filename,
        success: true,
        source: course.source
      });
    } catch (e: any) {
      console.error(`Error generating ${filename}:`, e.message);
      failCount++;
      reportEntries.push({
        title: course.name,
        slug: course.slug,
        level: course.level,
        filename,
        success: false,
        error: e.message,
        source: course.source
      });
    }
  }

  console.log('--- GENERATION COMPLETE ---');
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  // 3. Write markdown report to artifacts directory
  const reportPath = path.join(process.cwd(), 'brochures_generation_report.md');
  let md = `# Static Brochure Generation Report\n\n`;
  md += `This report outlines the pre-generation of static PDF brochures for Aurenza Academy courses.\n\n`;
  md += `## Summary Metrics\n`;
  md += `*   **Total Courses Processed**: ${allCourses.length}\n`;
  md += `*   **Brochures Generated Successfully**: ${successCount}\n`;
  md += `*   **Brochures Failed**: ${failCount}\n\n`;
  md += `## Detailed Course Brochure Log\n\n`;
  md += `| # | Course Title | Level | Target File | Status | Table Source |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  reportEntries.forEach((entry, idx) => {
    md += `| ${idx + 1} | ${entry.title} | ${entry.level} | \`${entry.filename}\` | ${entry.success ? '✅ Success' : '❌ Failed: ' + entry.error} | ${entry.source} |\n`;
  });

  fs.writeFileSync(reportPath, md, 'utf8');
  console.log(`Generated report saved to ${reportPath}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
