import { handlers } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const GET = (req: any, ctx: any) => {
  return (handlers as any).GET(req, ctx);
};

export const POST = handlers.POST;
