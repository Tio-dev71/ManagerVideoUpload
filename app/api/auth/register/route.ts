import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    // Password validation: min 8 chars, uppercase, lowercase, number
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'PASSWORD_TOO_SHORT' },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'PASSWORD_WEAK' },
        { status: 400 }
      );
    }

    const userEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'EMAIL_EXISTS' },
        { status: 400 }
      );
    }

    // Check if email is in the allowed list
    let allowed = await prisma.allowedEmail.findUnique({
      where: { email: userEmail },
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userEmail,
        password: hashedPassword,
        name: name || null,
        role: allowed ? allowed.role : 'STAFF',
        workspaceId: allowed ? allowed.workspaceId : null,
      },
    });

    return NextResponse.json(
      { message: 'OK', user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'REGISTER_FAILED' },
      { status: 500 }
    );
  }
}
