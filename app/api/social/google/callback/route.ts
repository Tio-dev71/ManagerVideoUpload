import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { encryptToken } from '@/lib/crypto';
import { getCredentials } from '@/lib/credentials';

// GET /api/social/google/callback — Handle Google OAuth callback
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error || !code) {
      return NextResponse.redirect(
        new URL('/settings?error=google_auth_failed', req.url)
      );
    }

    const credentials = await getCredentials(session.user.id);
    const clientId = credentials.GOOGLE_CLIENT_ID!;
    const clientSecret = credentials.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.AUTH_URL || 'http://localhost:3000'}/api/social/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('Google token exchange failed:', tokenData);
      return NextResponse.redirect(
        new URL('/settings?error=token_exchange_failed', req.url)
      );
    }

    const provider = state === 'google_drive' ? 'GOOGLE_DRIVE' : 'YOUTUBE';

    let accountName = 'Google Account';
    let youtubeChannelId = null;

    if (provider === 'YOUTUBE') {
      // Get channel info
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true`,
        {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        }
      );
      const channelData = await channelRes.json();
      const channel = channelData.items?.[0];
      if (channel) {
        accountName = channel.snippet.title;
        youtubeChannelId = channel.id;
      }
    } else {
      // Get user info for Drive
      const userRes = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        }
      );
      const userData = await userRes.json();
      accountName = userData.name || userData.email || 'Google Drive';
    }

    // Calculate expiry
    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : null;

    const encryptedAccessToken = encryptToken(tokenData.access_token);
    const encryptedRefreshToken = tokenData.refresh_token ? encryptToken(tokenData.refresh_token) : null;

    // Save to database
    await prisma.socialAccount.upsert({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: provider as any,
        },
      },
      update: {
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken || undefined,
        expiresAt,
        accountName,
        youtubeChannelId: provider === 'YOUTUBE' ? youtubeChannelId : undefined,
      },
      create: {
        userId: session.user.id,
        workspaceId: (session.user as any).workspaceId,
        provider: provider as any,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresAt,
        accountName,
        youtubeChannelId: provider === 'YOUTUBE' ? youtubeChannelId : null,
      },
    });

    return NextResponse.redirect(
      new URL(`/settings?success=${provider.toLowerCase()}`, req.url)
    );
  } catch (error: any) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(
      new URL('/settings?error=google_callback_error', req.url)
    );
  }
}
