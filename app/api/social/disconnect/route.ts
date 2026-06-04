import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// POST /api/social/disconnect?provider=META
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(req.url);
    const provider = url.searchParams.get('provider');

    if (!provider) {
      return NextResponse.json({ error: 'Provider required' }, { status: 400 });
    }

    await prisma.socialAccount.deleteMany({
      where: {
        userId: session.user.id,
        provider: provider as any,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
