import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hasEnv = !!process.env.DATABASE_URL;
    const envStart = process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] || 'no-host' : 'none';
    
    const coursesCount = await db.course.count();
    const batchesCount = await db.batch.count();
    const certCoursesCount = await db.certificationCourse.count();
    
    return NextResponse.json({
      success: true,
      hasEnv,
      databaseHost: envStart.split('/')[0] || 'no-host',
      coursesCount,
      batchesCount,
      certCoursesCount
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      hasEnv: !!process.env.DATABASE_URL,
      databaseHost: process.env.DATABASE_URL ? (process.env.DATABASE_URL.split('@')[1] || 'no-host').split('/')[0] : 'none',
      error: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}
