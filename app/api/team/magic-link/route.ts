import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const allowed = await prisma.allowedEmail.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!allowed) {
      return NextResponse.json({ error: 'Email not found in team' }, { status: 404 });
    }

    // Find or create the user in the database
    let user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: email.toLowerCase(), role: allowed.role }
      });
    }

    // Generate a secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days valid

    // Create a NextAuth session manually in the DB
    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      }
    });

    // Construct the magic link
    const baseUrl = process.env.AUTH_URL || new URL(req.url).origin;
    const link = `${baseUrl}/api/auth/set-session?token=${sessionToken}`;

    return NextResponse.json({ link });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
