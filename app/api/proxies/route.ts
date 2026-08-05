import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const proxies = await prisma.proxy.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(proxies);
  } catch (error) {
    console.error('Failed to fetch proxies:', error);
    return NextResponse.json({ error: 'Failed to fetch proxies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    // Support single creation or bulk import
    if (Array.isArray(data)) {
      const created = await prisma.proxy.createMany({
        data: data.map(p => ({
          protocol: p.protocol || 'http',
          host: p.host,
          port: parseInt(p.port),
          username: p.username || null,
          password: p.password || null,
        }))
      });
      return NextResponse.json({ count: created.count });
    } else {
      const proxy = await prisma.proxy.create({
        data: {
          protocol: data.protocol || 'http',
          host: data.host,
          port: parseInt(data.port),
          username: data.username || null,
          password: data.password || null,
        }
      });
      return NextResponse.json(proxy);
    }
  } catch (error) {
    console.error('Failed to create proxy:', error);
    return NextResponse.json({ error: 'Failed to create proxy' }, { status: 500 });
  }
}
