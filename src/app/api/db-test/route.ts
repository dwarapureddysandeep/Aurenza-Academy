import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envInfo = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasPostgresPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
    hasPostgresUrl: !!process.env.POSTGRES_URL,
  };

  const activeUrl = process.env.DATABASE_URL || 
                    process.env.POSTGRES_PRISMA_URL || 
                    process.env.POSTGRES_URL || 
                    'none';

  const databaseHost = activeUrl !== 'none' 
    ? (activeUrl.split('@')[1] || 'no-host').split('/')[0].split('?')[0] 
    : 'none';

  try {
    const coursesCount = await db.course.count();
    const batchesCount = await db.batch.count();
    const certCoursesCount = await db.certificationCourse.count();
    
    return NextResponse.json({
      success: true,
      envInfo,
      databaseHost,
      coursesCount,
      batchesCount,
      certCoursesCount
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      envInfo,
      databaseHost,
      error: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}

