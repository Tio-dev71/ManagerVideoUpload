import { handlers } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const GET = (req: any, ctx: any) => {
  if (req.url.includes('/api/auth/session') && process.env.NODE_ENV !== 'production') {
    return NextResponse.json({
      user: {
        id: 'local-super-admin',
        name: 'Local Super Admin',
        email: 'thond.topmedia.vn@gmail.com',
        role: 'SUPER_ADMIN'
      },
      expires: '2099-01-01T00:00:00.000Z'
    });
  }
  return handlers.GET(req, ctx);
};

export const POST = handlers.POST;
