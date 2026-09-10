import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import prisma from '@/lib/db';

const JWT_SECRET = process.env.AUTH_SECRET || 'topify-secret';
const TOKEN_TTL = '7d';

// Simple in-memory rate limit (resets on server restart — good enough for license auth)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

/**
 * POST /api/auth/license-login
 * Body: { licenseKey: string }
 * Returns: { token: string, user: { id, name, email, role } }
 *
 * Dùng bởi Desktop App (Electron) để đăng nhập bằng License Key.
 */
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Quá nhiều lần thử. Vui lòng chờ 1 phút.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const licenseKey = body.licenseKey?.trim();

    if (!licenseKey) {
      return NextResponse.json(
        { error: 'License Key không được để trống.' },
        { status: 400 }
      );
    }

    // Look up user by licenseKey
    const user = await prisma.user.findUnique({
      where: { licenseKey },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        workspaceId: true,
        licenseKey: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Mã bản quyền không hợp lệ hoặc đã hết hạn.' },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        workspaceId: user.workspaceId,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_TTL }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('[license-login]', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
