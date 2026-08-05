import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const actionType = searchParams.get('actionType');

    const where = actionType ? { actionType } : {};

    const [logs, total, runningTasksCount, totalComments, totalPosts] = await Promise.all([
      prisma.automationLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.automationLog.count({ where }),
      prisma.automationTask.count({ where: { status: 'RUNNING' } }),
      prisma.automationLog.count({ where: { actionType: 'COMMENT' } }),
      prisma.automationLog.count({ where: { actionType: { in: ['POST_REEL', 'POST_GROUP', 'POST'] } } })
    ]);
    
    return NextResponse.json({
      logs,
      total,
      totalPages: Math.ceil(total / limit),
      stats: {
        runningTasks: runningTasksCount,
        totalComments,
        totalPosts
      }
    });
  } catch (error: any) {
    console.error('Error fetching automation logs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
