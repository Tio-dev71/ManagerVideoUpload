import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { getCredentials } from '@/lib/credentials';

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

    // Fetch credentials properly using the fallback chain
    const credentials = await getCredentials(session.user.id);

    // Check environment variables
    const envStatus: Record<string, boolean> = {
      META_APP_ID: !!credentials.META_APP_ID,
      META_APP_SECRET: !!credentials.META_APP_SECRET,
      GOOGLE_CLIENT_ID: !!credentials.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!credentials.GOOGLE_CLIENT_SECRET,
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
