import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCredentials } from '@/lib/credentials';

// GET /api/social/google — Initiate Google OAuth flow (YouTube or Drive)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const credentials = await getCredentials(session.user.id);
    const clientId = credentials.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.AUTH_URL || 'http://localhost:3000'}/api/social/google/callback`;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Google OAuth credentials not configured.' },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const scope = url.searchParams.get('scope') || 'youtube';

    let scopes: string;
    let state: string;

    if (scope === 'drive') {
      scopes = 'https://www.googleapis.com/auth/drive.readonly';
      state = 'google_drive';
    } else {
      scopes = 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl';
      state = 'youtube';
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code&access_type=offline&prompt=consent&state=${state}`;

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
