import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import crypto from 'crypto';

function generateLicenseKey(): string {
  // Generates a key format like: TOP-XXXX-XXXX-XXXX
  const generateSegment = () => crypto.randomBytes(2).toString('hex').toUpperCase();
  return `TOP-${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user and workspace details
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspace: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Auto-generate license key if it doesn't exist
    if (!user.licenseKey) {
      const newKey = generateLicenseKey();
      user = await prisma.user.update({
        where: { id: userId },
        data: { licenseKey: newKey },
        include: {
          workspace: true,
        },
      });
    }

    // Calculate usage (videos uploaded this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    let videosUploaded = 0;
    if (user.workspaceId) {
       videosUploaded = await prisma.videoAsset.count({
        where: {
          workspaceId: user.workspaceId,
          createdAt: {
            gte: startOfMonth,
          },
        },
      });
    }

    return NextResponse.json({
      licenseKey: user.licenseKey,
      plan: user.workspace?.plan || 'FREE',
      usage: {
        videosUploaded,
      }
    });
  } catch (error: any) {
    console.error('[user-license]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
