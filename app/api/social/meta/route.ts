import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCredentials } from '@/lib/credentials';

// GET /api/social/meta — Initiate Meta OAuth flow
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const credentials = await getCredentials(session.user.id);
    const clientId = credentials.META_APP_ID;
    const redirectUri = process.env.META_REDIRECT_URI || `${process.env.AUTH_URL || 'http://localhost:3000'}/api/social/meta/callback`;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Meta OAuth credentials not configured.' },
        { status: 400 }
      );
    }

    const scopes = [
      'pages_manage_posts',
      'pages_read_engagement',
      'pages_show_list',
      'instagram_basic',
      'instagram_content_publish',
    ].join(',');

    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code&state=meta`;

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
