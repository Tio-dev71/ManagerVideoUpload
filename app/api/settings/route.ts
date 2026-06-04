import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

const ALLOWED_KEYS = ['META_APP_ID', 'META_APP_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];

// GET /api/settings - Fetch all settings (Admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const settings = await prisma.systemSetting.findMany();
    
    // Convert array to Record<string, string>
    const settingsMap = settings.reduce((acc: Record<string, string>, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ settings: settingsMap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/settings - Update settings (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();

    if (!body.settings || typeof body.settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 });
    }

    const settings = body.settings as Record<string, string>;

    // Only allow known keys and trim whitespace to prevent OAuth URL malformation
    const operations = Object.entries(settings)
      .filter(([key]) => ALLOWED_KEYS.includes(key))
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => {
        const trimmedValue = value.trim();
        return prisma.systemSetting.upsert({
          where: { key },
          update: { value: trimmedValue },
          create: { key, value: trimmedValue },
        });
      });

    if (operations.length > 0) {
      await prisma.$transaction(operations);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
