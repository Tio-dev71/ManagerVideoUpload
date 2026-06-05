import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/social/status — Get connection status for all providers
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get connected accounts for the workspace
    const socialAccounts = await prisma.socialAccount.findMany({
      where: { workspaceId: (session.user as any).workspaceId },
      select: {
        id: true,
        provider: true,
        accountName: true,
        pageId: true,
        instagramBusinessId: true,
        youtubeChannelId: true,
        expiresAt: true,
      },
    });

    const connections = socialAccounts.map((account: any) => ({
      ...account,
      connected: true,
    }));

    // Fetch System Settings for credentials
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: ['META_APP_ID', 'META_APP_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']
        }
      }
    });

    const settingsMap = settings.reduce((acc: Record<string, string>, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    // Check environment variables (DB takes precedence over process.env)
    const envStatus: Record<string, boolean> = {
      META_APP_ID: !!(settingsMap.META_APP_ID || process.env.META_APP_ID),
      META_APP_SECRET: !!(settingsMap.META_APP_SECRET || process.env.META_APP_SECRET),
      GOOGLE_CLIENT_ID: !!(settingsMap.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID),
      GOOGLE_CLIENT_SECRET: !!(settingsMap.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET),
    };

    return NextResponse.json({
      connections,
      connected: connections.length,
      envStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
