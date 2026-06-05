import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// POST /api/team/check — Check if an email is in the allowed list (public, no auth needed)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email) {
      return NextResponse.json({ allowed: false });
    }

    const allowed = await prisma.allowedEmail.findUnique({
      where: { email },
    });

    return NextResponse.json({ allowed: !!allowed });
  } catch {
    return NextResponse.json({ allowed: false });
  }
}
