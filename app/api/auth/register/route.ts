import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ email và mật khẩu.' },
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
        { error: 'Email này đã được sử dụng.' },
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
      { message: 'Đăng ký thành công.', user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình đăng ký.' },
      { status: 500 }
    );
  }
}
