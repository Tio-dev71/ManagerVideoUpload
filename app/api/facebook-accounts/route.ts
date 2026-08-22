import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accounts = await prisma.facebookAccount.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(accounts);
  } catch (error: any) {
    console.error('Failed to fetch facebook accounts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { rawAccounts } = body; // format: UID|Pass|2FA|Cookie or similar

    if (!rawAccounts) {
      return NextResponse.json({ error: 'Missing raw account data' }, { status: 400 });
    }

    const lines = rawAccounts.split('\n').filter((l: string) => l.trim() !== '');
    const addedAccounts = [];

    for (const line of lines) {
      const parts = line.split('|');
      const uid = parts[0]?.trim();
      const password = parts[1]?.trim();
      const twoFactorCode = parts[2]?.trim();
      const cookie = parts.length > 3 ? parts.slice(3).join('|').trim() : '';

      if (uid && password) {
        const name = `Clone ${uid.substring(0, 5)}...`;
        const profileId = `profile_${uid}_${Date.now()}`;
        
        const account = await prisma.facebookAccount.create({
          data: {
            name,
            uid,
            password,
            twoFactorCode,
            cookie,
            profileId,
            status: 'LIVE',
            proxy: 'http://127.0.0.1:9999',
          },
        });
        addedAccounts.push(account);
      }
    }

    return NextResponse.json({ success: true, count: addedAccounts.length, addedAccounts });
  } catch (error: any) {
    console.error('Failed to create facebook accounts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.facebookAccount.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete facebook account:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
