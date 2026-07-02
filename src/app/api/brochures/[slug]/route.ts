import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generatePdfBuffer, getSyllabusFileName } from '@/lib/pdf-generator';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: 'Missing course slug' }, { status: 400 });
  }

  try {
    let courseData: any = null;

    // Check Course model
    const dbCourse = await db.course.findUnique({
      where: { slug }
    });

    if (dbCourse) {
      courseData = {
        name: dbCourse.name,
        slug: dbCourse.slug,
        duration: dbCourse.duration,
        level: dbCourse.level,
        certificationBody: dbCourse.certificationBody || 'Aurenza Academy',
        description: dbCourse.description || '',
        courseHighlights: dbCourse.courseHighlights || '',
        syllabus: dbCourse.syllabus || '',
        mentorName: dbCourse.mentorName,
        mentorExp: dbCourse.mentorExp,
        mentorBio: dbCourse.mentorBio
      };
    } else {
      // Check CertificationCourse model
      const certCourse = await db.certificationCourse.findUnique({
        where: { slug },
        include: { category: true }
      });

      if (certCourse) {
        courseData = {
          name: certCourse.title,
          slug: certCourse.slug,
          duration: certCourse.duration,
          level: certCourse.level,
          certificationBody: certCourse.category?.name || certCourse.certificationProvider || 'Professional Certification',
          description: certCourse.shortDescription || `Master this dynamic ${certCourse.title} certification program mapping directly to international industry guidelines.`,
          courseHighlights: JSON.stringify(['Weekend live interactive cohorts', 'Led by active technology directors', 'Direct recruitment referrals']),
          syllabus: JSON.stringify([
            { module: "Module 1: Introduction to " + certCourse.title, details: "Overview of the core framework parameters, key terminology definitions, and organizational benefits of achieving certification." },
            { module: "Module 2: Core Concepts & Practice", details: "Deep dive into applying standard methodologies, worksheets, practical case studies, and corporate workflow exercises." },
            { module: "Module 3: Certification Preparation", details: "Detailed walkthrough of exam structure, specific syllabus weighting areas, and live reviews of mock exam question papers." }
          ]),
          mentorName: 'Alpesh Vasant',
          mentorExp: '15+ Years Experience',
          mentorBio: 'Executive Program Mentor and agile transformation director with extensive experience training over 5,000 corporate professionals globally.'
        };
      }
    }

    if (!courseData) {
      return NextResponse.json({ error: 'Brochure Coming Soon' }, { status: 404 });
    }

    // Resolve premium filename using getSyllabusFileName
    const filename = getSyllabusFileName(courseData.name);
    const staticPath = path.join(process.cwd(), 'public', 'brochures', filename);

    // 1. Try serving static PDF if it already exists on disk
    if (fs.existsSync(staticPath)) {
      try {
        const pdfBuffer = fs.readFileSync(staticPath);
        return new NextResponse(pdfBuffer as any, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${filename}"`,
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      } catch (e) {
        console.error(`Failed to read static brochure PDF for ${filename}:`, e);
      }
    }

    // 2. Generate PDF since it does not exist on disk
    const pdfBuffer = await generatePdfBuffer(courseData);

    // Best-effort write to static folder (ignores errors in read-only environments like Vercel)
    try {
      const dir = path.dirname(staticPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(staticPath, pdfBuffer);
    } catch (e) {
      console.warn(`Could not save generated PDF to public directory (likely read-only fs):`, e);
    }

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-store'
      }
    });

  } catch (err) {
    console.error(`Failed to dynamically generate brochure PDF for ${slug}:`, err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return new NextResponse(null, { status: 400 });
    }

    const dbCourse = await db.course.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (dbCourse) {
      return new NextResponse(null, { status: 200 });
    }

    const certCourse = await db.certificationCourse.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (certCourse) {
      return new NextResponse(null, { status: 200 });
    }

    return new NextResponse(null, { status: 404 });
  } catch (err) {
    console.error(`Failed to handle HEAD request for brochure check:`, err);
    return new NextResponse(null, { status: 500 });
  }
}
