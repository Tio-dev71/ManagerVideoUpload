import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

const ALLOWED_KEYS = ['META_APP_ID', 'META_APP_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];

// GET /api/settings - Fetch user's own settings
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const userId = session.user.id;
    const userCreds = await prisma.userCredential.findMany({
      where: { userId }
    });
    
    const settingsMap: Record<string, string> = {};
    for (const cred of userCreds) {
      if (cred.provider === 'GOOGLE') {
        settingsMap.GOOGLE_CLIENT_ID = cred.clientId;
        settingsMap.GOOGLE_CLIENT_SECRET = cred.clientSecret;
      }
      if (cred.provider === 'META') {
        settingsMap.META_APP_ID = cred.clientId;
        settingsMap.META_APP_SECRET = cred.clientSecret;
      }
    }

    // Optionally merge with system settings for backward compatibility on UI display, but here we just return the user's specific ones
    return NextResponse.json({ settings: settingsMap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/settings - Update user's own settings
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    const userId = session.user.id;

    const body = await req.json();

    if (!body.settings || typeof body.settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 });
    }

    const settings = body.settings as Record<string, string>;

    const operations = [];

    // Handle Google
    if (settings.GOOGLE_CLIENT_ID !== undefined || settings.GOOGLE_CLIENT_SECRET !== undefined) {
      operations.push(
        prisma.userCredential.upsert({
          where: { userId_provider: { userId, provider: 'GOOGLE' } },
          update: {
            clientId: (settings.GOOGLE_CLIENT_ID || '').trim(),
            clientSecret: (settings.GOOGLE_CLIENT_SECRET || '').trim(),
          },
          create: {
            userId,
            provider: 'GOOGLE',
            clientId: (settings.GOOGLE_CLIENT_ID || '').trim(),
            clientSecret: (settings.GOOGLE_CLIENT_SECRET || '').trim(),
          },
        })
      );
    }

    // Handle Meta
    if (settings.META_APP_ID !== undefined || settings.META_APP_SECRET !== undefined) {
      operations.push(
        prisma.userCredential.upsert({
          where: { userId_provider: { userId, provider: 'META' } },
          update: {
            clientId: (settings.META_APP_ID || '').trim(),
            clientSecret: (settings.META_APP_SECRET || '').trim(),
          },
          create: {
            userId,
            provider: 'META',
            clientId: (settings.META_APP_ID || '').trim(),
            clientSecret: (settings.META_APP_SECRET || '').trim(),
          },
        })
      );
    }

    if (operations.length > 0) {
      await prisma.$transaction(operations);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
