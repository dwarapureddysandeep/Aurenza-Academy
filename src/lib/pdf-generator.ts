import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export function getSyllabusFileName(title: string): string {
  const clean = title.replace(/[®™]/g, '').trim();
  return clean
    .split(/[\s-]+/)
    .map(word => {
      const upper = word.toUpperCase();
      if (['AWS', 'ITIL', 'PMP', 'CSM', 'CAPM', 'CPC', 'PMI', 'CMMI', 'TÜV', 'SÜD', 'FRM', 'STP', 'IFPUG', 'FPA', 'CPC', 'CPMA', 'LMS', 'JS', 'AI', 'BI'].includes(upper)) {
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('-') + '-Syllabus.pdf';
}

export function generatePdfForCourse(course: any, outputPath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    generatePdfBuffer(course)
      .then(buffer => {
        fs.writeFile(outputPath, buffer, (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      })
      .catch(reject);
  });
}

export function generatePdfBuffer(course: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
      const buffers: any[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', (err) => reject(err));

      // Color Palette
      const primaryColor = '#7A008C'; // Brand Purple
      const secondaryColor = '#E85AD9'; // Brand Pink
      const navyAccent = '#0F172A'; // Dark Navy
      const textPrimary = '#0C182F'; // Dark Slate
      const textSecondary = '#475569'; // Slate Gray
      const lightBg = '#FAFAFC'; // Very light gray/blue
      const borderColor = '#E2E8F0';

      // =======================================================================
      // PAGE 1: COVER PAGE
      // =======================================================================
      // Abstract background accent bands
      doc.rect(0, 0, 595.28, 15).fill(primaryColor);
      doc.rect(0, 15, 595.28, 5).fill(secondaryColor);

      // Logo
      const logoPath = path.join(process.cwd(), 'public', 'aurenza-only-wordmark.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 140 });
      } else {
        doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(22).text('AURENZA ACADEMY', 50, 45);
      }

      // Tagline
      doc.fillColor(textSecondary)
         .font('Helvetica-Bold')
         .fontSize(9)
         .text('PROFESSIONAL STUDY GUIDE & INDUSTRY SYLLABUS', 50, 95, { characterSpacing: 1.5 });

      // Title
      doc.fillColor(navyAccent)
         .font('Helvetica-Bold')
         .fontSize(28)
         .text(course.name.replace(/[®™]/g, ''), 50, 120, { width: 495.28, lineGap: 4 });

      // Secondary Tagline
      doc.fillColor(primaryColor)
         .font('Helvetica-Oblique')
         .fontSize(11)
         .text('Master Industry Skills. Build Your Future.', 50, doc.y + 8);

      // Metadata summary card grid
      const metaY = doc.y + 25;
      doc.roundedRect(50, metaY, 495.28, 75, 6).fill(lightBg);
      doc.roundedRect(50, metaY, 495.28, 75, 6).lineWidth(1).stroke(borderColor);

      const colW = 495.28 / 4;
      const labels = ['CATEGORY', 'DURATION', 'LEVEL', 'DELIVERY MODE'];
      const values = [
        course.certificationBody || 'Professional Certification',
        course.duration || '4-8 Weeks',
        course.level || 'Beginner',
        'Live Instructor-Led / Online'
      ];

      for (let i = 0; i < 4; i++) {
        const cx = 50 + i * colW;
        doc.fillColor(textSecondary).font('Helvetica-Bold').fontSize(7.5).text(labels[i], cx + 20, metaY + 20);
        doc.fillColor(textPrimary).font('Helvetica-Bold').fontSize(9.5).text(values[i], cx + 20, metaY + 38, { width: colW - 30, height: 25, ellipsis: true });
        if (i < 3) {
          doc.moveTo(cx + colW, metaY + 15).lineTo(cx + colW, metaY + 60).lineWidth(0.5).stroke(borderColor);
        }
      }

      // Hero visual illustration
      const heroPath = path.join(process.cwd(), 'public', 'hero-visual.png');
      if (fs.existsSync(heroPath)) {
        doc.image(heroPath, 120, metaY + 105, { width: 355 });
      } else {
        // Fallback abstract visual placeholder if image doesn't exist
        const placeholderY = metaY + 120;
        doc.roundedRect(120, placeholderY, 355, 200, 8).fill('#F8FAFC');
        doc.roundedRect(120, placeholderY, 355, 200, 8).lineWidth(1).stroke(borderColor);
        doc.circle(297.64, placeholderY + 100, 40).fill(primaryColor);
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(12).text('AURENZA', 297.64 - 50, placeholderY + 95, { width: 100, align: 'center' });
      }

      // Footer
      const footY = 705;
      doc.moveTo(50, footY).lineTo(545.28, footY).lineWidth(0.5).stroke(borderColor);

      doc.fillColor(textPrimary).font('Helvetica-Bold').fontSize(9).text('AURENZA ACADEMY', 50, footY + 15);
      doc.fillColor(textSecondary).font('Helvetica').fontSize(8.5).text('Counseling Support: info@aurenzaacademy.com  |  +91 70130 57827', 50, footY + 30);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(8.5).text('www.aurenzaacademy.com', 50, footY + 45);

      // QR Code placeholder box
      doc.rect(465, footY + 12, 80, 80).fill('#FAFAFC');
      doc.rect(465, footY + 12, 80, 80).lineWidth(1).stroke(borderColor);
      doc.fillColor(textSecondary).font('Helvetica-Bold').fontSize(6).text('SCAN FOR DETAILS', 465, footY + 50, { width: 80, align: 'center' });

      // =======================================================================
      // PAGE 2: COURSE OVERVIEW & DETAILS
      // =======================================================================
      doc.addPage();
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(16).text('Program Overview & Details', 50, 70);
      doc.moveTo(50, 90).lineTo(150, 90).lineWidth(2).stroke(primaryColor);

      // Left Column (Overview, Outcomes)
      const colY = 110;
      doc.roundedRect(50, colY, 235, 175, 6).fill(lightBg);
      doc.roundedRect(50, colY, 235, 175, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('COURSE OVERVIEW', 65, colY + 15);
      
      const cleanDesc = (course.description || 'This certification program is designed for professionals and graduates aiming to build premium, in-demand technical expertise. Bypass academic textbook theories and focus on practical workflows.')
        .replace(/<[^>]*>/g, '');
      doc.fillColor(textPrimary).font('Helvetica').fontSize(8.5).text(cleanDesc, 65, colY + 35, { width: 205, height: 130, align: 'justify', lineGap: 2.5, ellipsis: true });

      // Learning Outcomes card
      doc.roundedRect(50, colY + 195, 235, 195, 6).fill(lightBg);
      doc.roundedRect(50, colY + 195, 235, 195, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('LEARNING OUTCOMES', 65, colY + 210);
      
      const outcomes = [
        'Master core framework definitions, parameters, and guidelines.',
        'Deploy custom configurations and test suites in sandbox environments.',
        'Acquire global certification matching international standards.',
        'Solve real-world case studies and industry-grade projects.'
      ];
      let oy = colY + 232;
      outcomes.forEach(out => {
        doc.circle(70, oy + 5, 2.5).fill(primaryColor);
        doc.fillColor(textPrimary).font('Helvetica').fontSize(8.5).text(out, 80, oy, { width: 190, lineGap: 1.5 });
        oy += 38;
      });

      // Right Column (Skills, Who Should Attend, Prerequisites)
      doc.roundedRect(310, colY, 235, 110, 6).fill(lightBg);
      doc.roundedRect(310, colY, 235, 110, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('KEY SKILLS DEVELOPED', 325, colY + 15);

      const skills = ['Practical Sandbox Labs', 'System Optimization', 'Troubleshooting Log Loops', 'Standard Frameworks', 'Audit Compliance', 'Exam Success Strategies'];
      let sy = colY + 35;
      skills.forEach((sk, sIdx) => {
        const sx = 325 + (sIdx % 2) * 105;
        const cy = sy + Math.floor(sIdx / 2) * 22;
        doc.roundedRect(sx, cy, 95, 16, 3).fill('#FFFFFF');
        doc.roundedRect(sx, cy, 95, 16, 3).lineWidth(0.5).stroke(borderColor);
        doc.fillColor(textPrimary).font('Helvetica-Bold').fontSize(7.5).text(sk, sx + 5, cy + 5, { width: 85, height: 10, ellipsis: true });
      });

      // Who Should Attend card
      doc.roundedRect(310, colY + 125, 235, 125, 6).fill(lightBg);
      doc.roundedRect(310, colY + 125, 235, 125, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('WHO SHOULD ATTEND', 325, colY + 140);
      doc.fillColor(textPrimary).font('Helvetica').fontSize(8.5).text('• Working professionals transitioning into modern tech pathways.\n• Developers and engineers seeking structured globally accredited credentials.\n• Freshers looking to bypass generic academic curriculum pipelines.', 325, colY + 160, { width: 205, lineGap: 3 });

      // Prerequisites card
      doc.roundedRect(310, colY + 265, 235, 125, 6).fill(lightBg);
      doc.roundedRect(310, colY + 265, 235, 125, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('PREREQUISITES', 325, colY + 280);
      doc.fillColor(textPrimary).font('Helvetica').fontSize(8.5).text('• Basic programming concepts or spreadsheet familiarity is helpful.\n• A personal computer with a minimum of 8GB RAM.\n• Reliable high-speed internet connectivity for live sandbox sessions.', 325, colY + 300, { width: 205, lineGap: 3 });

      // Full-width program features banner (instead of career roadmap)
      const featBannerY = 520;
      doc.roundedRect(50, featBannerY, 495.28, 160, 6).fill(lightBg);
      doc.roundedRect(50, featBannerY, 495.28, 160, 6).lineWidth(1).stroke(borderColor);
      doc.rect(50, featBannerY, 495.28, 4).fill(primaryColor);

      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10.5).text('AURENZA ACADEMY PROFESSIONAL EXCELLENCE', 70, featBannerY + 15);

      const fPoints = [
        'Curriculum Aligned: Program structure designed to reflect contemporary international guidelines.',
        'Director Cohorts: Active enterprise tech directors provide coaching during cohort lectures.',
        'Sandbox Practice: Complete browser-based sandbox cloud setup with zero local installation overhead.',
        'Recruiter Referrals: Dedicated profile routing directly to corporate hiring channels post certification.'
      ];

      let fpy = featBannerY + 38;
      fPoints.forEach(fp => {
        doc.circle(75, fpy + 5, 2.5).fill(primaryColor);
        doc.fillColor(textPrimary).font('Helvetica').fontSize(8.5).text(fp, 85, fpy, { width: 440, lineGap: 1.5 });
        fpy += 28;
      });

      // =======================================================================
      // PAGE 3: COMPLETE CURRICULUM
      // =======================================================================
      doc.addPage();
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(16).text('Complete Program Curriculum', 50, 70);
      doc.moveTo(50, 90).lineTo(150, 90).lineWidth(2).stroke(primaryColor);

      // Parse Syllabus modules from DB
      let rawModules = [];
      if (course.syllabus) {
        try {
          const parsed = JSON.parse(course.syllabus);
          if (Array.isArray(parsed)) rawModules = parsed;
        } catch (e) {}
      }

      if (rawModules.length === 0) {
        rawModules = [
          { module: 'Module 1: Foundations & Architecture', details: 'Introduction to standard framework definitions, structural parameters, and organizational benefits of achieving certification. Alignment to international benchmarks.', hours: '12 Hours' },
          { module: 'Module 2: Practical Exercises & Worksheets', details: 'Deep dive into implementing templates, sandbox lab modules, and real-world project scenarios. Practice spreadsheets.', hours: '16 Hours' },
          { module: 'Module 3: Exam Success Strategy & Mocks', details: 'Detailed walkthrough of exam weightings, blueprint updates, and mock simulator code dry runs with live feedback sessions.', hours: '8 Hours' },
          { module: 'Module 4: Capstone Execution & Delivery', details: 'Execution of a comprehensive capstone build, integrating tools, configurations, and mock reviews by technology directors.', hours: '10 Hours' }
        ];
      }

      const numModules = rawModules.length;
      let cardHeight = 200;
      let rowSpacing = 220;
      if (numModules > 6) {
        cardHeight = 138;
        rowSpacing = 152;
      } else if (numModules > 4) {
        cardHeight = 185;
        rowSpacing = 200;
      }

      rawModules.slice(0, 8).forEach((mod: any, idx: number) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const mx = col === 0 ? 50 : 310;
        const my = 120 + row * rowSpacing;

        // Draw card background
        doc.roundedRect(mx, my, 235, cardHeight, 6).fill(lightBg);
        doc.roundedRect(mx, my, 235, cardHeight, 6).lineWidth(1).stroke(borderColor);
        doc.rect(mx, my, 235, 4).fill(primaryColor);

        // Card Title
        doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text(mod.module || `Module ${idx + 1}`, mx + 15, my + 15, { width: 205, height: 30, ellipsis: true });
        
        // Duration
        doc.fillColor(textSecondary).font('Helvetica-Bold').fontSize(8).text(mod.hours || '10 Hours', mx + 15, my + 34);

        // Details (bullet points or short text)
        doc.fillColor(textPrimary).font('Helvetica').fontSize(8.5);
        const detailsText = mod.details || 'Topics covering system parameters, workflows, and core framework alignments.';
        
        // Wrap/format details nicely
        doc.text(detailsText, mx + 15, my + 48, {
          width: 205,
          height: cardHeight - 65,
          lineGap: 2.5,
          ellipsis: true
        });
      });

      // Note at the bottom if modules got truncated
      if (numModules > 8) {
        doc.fillColor(textSecondary)
           .font('Helvetica-Bold')
           .fontSize(8)
           .text('* Additional advanced training modules are included in the online curriculum workspace.', 50, 740, { width: 495.28, align: 'center' });
      }

      // =======================================================================
      // PAGE 4: CERTIFICATION DETAILS & WHY AURENZA
      // =======================================================================
      doc.addPage();
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(16).text('Certification & Program Features', 50, 70);
      doc.moveTo(50, 90).lineTo(150, 90).lineWidth(2).stroke(primaryColor);

      // Left Column: Certification Details Table
      const certY = 110;
      doc.roundedRect(50, certY, 235, 140, 6).fill(lightBg);
      doc.roundedRect(50, certY, 235, 140, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('CERTIFICATION DETAILS', 65, certY + 15);

      const tableRows = [
        { label: 'Exam Format', val: 'Multiple Choice / Scenarios' },
        { label: 'Exam Duration', val: '120 - 180 Minutes' },
        { label: 'Passing Score', val: '65% - 70%' },
        { label: 'Exam Validity', val: 'Lifetime Credential' }
      ];

      tableRows.forEach((row, rIdx) => {
        const ry = certY + 40 + rIdx * 22;
        doc.fillColor(textSecondary).font('Helvetica-Bold').fontSize(8).text(row.label, 65, ry);
        doc.fillColor(textPrimary).font('Helvetica-Bold').fontSize(8).text(row.val, 160, ry, { width: 110, align: 'right' });
      });

      // Certificate Mockup Preview
      const mockY = certY + 155;
      doc.roundedRect(50, mockY, 235, 180, 6).fill('#FFFFFF');
      doc.roundedRect(50, mockY, 235, 180, 6).lineWidth(1.5).stroke('#C8D1E0');
      // Inner thin frame
      doc.roundedRect(56, mockY + 6, 223, 168, 4).lineWidth(0.5).stroke('#7A008C');

      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(9).text('AURENZA ACADEMY', 56, mockY + 25, { width: 223, align: 'center' });
      doc.fillColor(textSecondary).font('Helvetica').fontSize(6).text('CERTIFICATE OF ACHIEVEMENT', 56, mockY + 40, { width: 223, align: 'center' });
      doc.fillColor(textPrimary).font('Helvetica').fontSize(5.5).text('This is to certify that the candidate has successfully completed all coursework for', 70, mockY + 60, { width: 195, align: 'center' });
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(7.5).text(course.name.replace(/[®™]/g, '').toUpperCase(), 70, mockY + 75, { width: 195, align: 'center', height: 18, ellipsis: true });
      doc.fillColor(textSecondary).font('Helvetica').fontSize(5).text('and passed the internal mock exams aligned to international frameworks.', 70, mockY + 98, { width: 195, align: 'center' });

      // Signatures
      doc.moveTo(75, mockY + 145).lineTo(125, mockY + 145).lineWidth(0.5).stroke(borderColor);
      doc.moveTo(160, mockY + 145).lineTo(210, mockY + 145).lineWidth(0.5).stroke(borderColor);
      doc.fillColor(textSecondary).font('Helvetica').fontSize(4.5).text('Program Director', 75, mockY + 150, { width: 50, align: 'center' });
      doc.text('Registrar Office', 160, mockY + 150, { width: 50, align: 'center' });
      
      // Gold seal shape
      doc.circle(142.5, mockY + 130, 8).fill('#E2C044');

      // Right Column: Why Choose Aurenza Academy Features Checklist
      doc.roundedRect(310, certY, 235, 335, 6).fill(lightBg);
      doc.roundedRect(310, certY, 235, 335, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('WHY CHOOSE AURENZA ACADEMY', 325, certY + 15);

      const features = [
        { title: 'Live Cohorts led by Directors', desc: 'Interact with active industry transformation directors.' },
        { title: 'Hands-on Cloud Sandbox Labs', desc: 'Deploy cloud instances instantly in your browser.' },
        { title: 'Industry Case Studies', desc: 'Real-world projects mapped to actual enterprise needs.' },
        { title: 'Direct Placements Referral', desc: 'Profiles routed directly to recruiters in our network.' },
        { title: 'Auri AI Resume Optimization', desc: 'Optimize your portfolio to bypass automatic ATS filters.' },
        { title: 'Lifetime Cohort Log Access', desc: 'Never lose access to recorded classes and study materials.' }
      ];

      let fy = certY + 40;
      features.forEach(feat => {
        // Draw small pink checkmark box
        doc.roundedRect(325, fy + 2, 10, 10, 2).fill(primaryColor);
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(6.5).text('✓', 325, fy + 4, { width: 10, align: 'center' });
        
        doc.fillColor(textPrimary).font('Helvetica-Bold').fontSize(8.5).text(feat.title, 342, fy);
        doc.fillColor(textSecondary).font('Helvetica').fontSize(7.5).text(feat.desc, 342, fy + 12, { width: 190, lineGap: 1.5 });
        fy += 45;
      });

      // Bottom Step-by-Step student journey timeline
      const journeyY = 490;
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(12).text('Your Certification & Career Journey Timeline', 50, journeyY);
      doc.moveTo(50, journeyY + 15).lineTo(545.28, journeyY + 15).lineWidth(0.5).stroke(borderColor);

      const timelineSteps = ['Secure Seat', 'Weekend Training', 'Deploy Sandbox Labs', 'Internal Mocks', 'Claim Certificate', 'Direct Placements'];
      doc.moveTo(85, journeyY + 60).lineTo(510, journeyY + 60).lineWidth(1.5).stroke(borderColor);

      timelineSteps.forEach((st, idx) => {
        const sx = 85 + idx * 85;
        doc.circle(sx, journeyY + 60, 6).fill(idx === timelineSteps.length - 1 ? secondaryColor : primaryColor);
        doc.fillColor(textPrimary).font('Helvetica-Bold').fontSize(7.5).text(st, sx - 40, journeyY + 75, { width: 80, align: 'center', lineGap: 1.5 });
      });

      // =======================================================================
      // PAGE 5: ABOUT, STATS & CALL TO ACTION
      // =======================================================================
      doc.addPage();
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(16).text('Connect with Aurenza Admissions', 50, 70);
      doc.moveTo(50, 90).lineTo(150, 90).lineWidth(2).stroke(primaryColor);

      // Left Column: About & Why Thousands Trust Us
      const contactY = 110;
      doc.roundedRect(50, contactY, 235, 175, 6).fill(lightBg);
      doc.roundedRect(50, contactY, 235, 175, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('ABOUT AURENZA ACADEMY', 65, contactY + 15);
      
      const aboutText = 'Aurenza Academy is a premium global technical credential provider. We help working professionals transition into top-tier tech roles. Over 15,000+ candidates have completed our training cohorts and unlocked higher salaries across 500+ global brands.';
      doc.fillColor(textPrimary).font('Helvetica').fontSize(8.5).text(aboutText, 65, contactY + 35, { width: 205, align: 'justify', lineGap: 2.5 });

      // Trust card (instead of testimonial quote)
      doc.roundedRect(50, contactY + 190, 235, 145, 6).fill(lightBg);
      doc.roundedRect(50, contactY + 190, 235, 145, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('WHY LEARNERS TRUST US', 65, contactY + 205);

      const trustText = 'We prioritize practical competency over static theories. Candidates study using live sandboxed cloud terminals, complete case assessments co-authored by enterprise technical leads, and transition directly to Aurenza referral programs.';
      doc.fillColor(textPrimary).font('Helvetica').fontSize(8.5).text(trustText, 65, contactY + 225, { width: 205, align: 'justify', lineGap: 2.5 });

      // Right Column: Stats Grid
      doc.roundedRect(310, contactY, 235, 140, 6).fill(lightBg);
      doc.roundedRect(310, contactY, 235, 140, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('ACADEMY STATISTICS', 325, contactY + 15);

      const stats = [
        { val: '50+', label: 'Programs' },
        { val: '15k+', label: 'Alumni' },
        { val: '120+', label: 'Corporates' },
        { val: '95%', label: 'Placements' }
      ];

      stats.forEach((st, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const sx = 325 + col * 100;
        const sy = contactY + 42 + row * 45;

        doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(16).text(st.val, sx, sy);
        doc.fillColor(textSecondary).font('Helvetica').fontSize(8).text(st.label, sx, sy + 18);
      });

      // Counselor Contact card
      doc.roundedRect(310, contactY + 155, 235, 180, 6).fill(lightBg);
      doc.roundedRect(310, contactY + 155, 235, 180, 6).lineWidth(1).stroke(borderColor);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('COUNSELING & ADMISSIONS', 325, contactY + 170);

      const contactDetails = [
        { label: 'Email', val: 'info@aurenzaacademy.com' },
        { label: 'Phone', val: '+91 70130 57827' },
        { label: 'LinkedIn', val: '/company/aurenza-academy' },
        { label: 'Hours', val: '9:00 AM - 9:00 PM IST (Mon-Sun)' }
      ];

      let cy = contactY + 192;
      contactDetails.forEach(cd => {
        doc.fillColor(textSecondary).font('Helvetica-Bold').fontSize(7.5).text(cd.label.toUpperCase(), 325, cy);
        doc.fillColor(textPrimary).font('Helvetica-Bold').fontSize(8.5).text(cd.val, 325, cy + 10, { width: 130, ellipsis: true });
        cy += 30;
      });

      // Right column QR Code Box in counselor card
      doc.rect(460, contactY + 192, 70, 70).fill('#FFFFFF');
      doc.rect(460, contactY + 192, 70, 70).lineWidth(1).stroke(borderColor);
      doc.fillColor(textSecondary).font('Helvetica-Bold').fontSize(5.5).text('SCAN CODE', 460, contactY + 225, { width: 70, align: 'center' });

      // Bottom Call-To-Action Banner
      const ctaY = 495;
      doc.roundedRect(50, ctaY, 495.28, 220, 8).fill(navyAccent);

      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(18).text('Reserve Your Cohort Seat Today!', 50, ctaY + 35, { width: 495.28, align: 'center' });
      doc.fillColor(secondaryColor).font('Helvetica-Bold').fontSize(11).text('START YOUR LEARNING JOURNEY WITH AURENZA ACADEMY', 50, ctaY + 60, { width: 495.28, align: 'center', characterSpacing: 1 });

      const ctaDesc = 'Enroll immediately to secure 12 months of unlimited cloud sandbox terminals, custom resume parsing optimized by Auri AI, and direct referrals to corporate technology hiring directors in our recruitment panel.';
      doc.fillColor('#E2E8F0').font('Helvetica').fontSize(9.5).text(ctaDesc, 100, ctaY + 88, { width: 395.28, align: 'center', lineGap: 3 });

      // Action button style
      doc.roundedRect(200, ctaY + 145, 195.28, 35, 6).fill(primaryColor);
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10).text('ENROLL NOW', 200, ctaY + 158, { width: 195.28, align: 'center' });

      // =======================================================================
      // FOOTERS & HEADERS INJECTION LOOP
      // =======================================================================
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        if (i > 0) {
          // Header
          doc.fillColor('#8A8A9A')
             .font('Helvetica-Bold')
             .fontSize(7)
             .text(`${course.name.replace(/[®™]/g, '').toUpperCase()}  |  OFFICIAL PROGRAM SYLLABUS`, 50, 35);
          
          doc.moveTo(50, 48)
             .lineTo(545.28, 48)
             .lineWidth(0.5)
             .stroke(borderColor);

          // Footer
          doc.moveTo(50, 805)
             .lineTo(545.28, 805)
             .lineWidth(0.5)
             .stroke(borderColor);
             
          doc.fillColor('#8A8A9A')
             .font('Helvetica')
             .fontSize(7.5)
             .text('Aurenza Academy  •  info@aurenzaacademy.com  •  +91 70130 57827  •  www.aurenzaacademy.com', 50, 812, {
               width: 495.28,
               align: 'center'
             });

          doc.text(`Page ${i + 1} of ${range.count}`, 50, 812, {
            width: 495.28,
            align: 'right'
          });
        }
      }

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
