import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { encryptToken } from '@/lib/crypto';
import { getCredentials } from '@/lib/credentials';

// GET /api/social/meta/callback — Handle Meta OAuth callback
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error || !code) {
      return NextResponse.redirect(
        new URL('/settings?error=meta_auth_failed', req.url)
      );
    }

    const credentials = await getCredentials(session.user.id);
    const clientId = credentials.META_APP_ID!;
    const clientSecret = credentials.META_APP_SECRET!;
    const redirectUri = process.env.META_REDIRECT_URI || `${process.env.AUTH_URL || 'http://localhost:3000'}/api/social/meta/callback`;

    // Exchange code for token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${clientSecret}&code=${code}`
    );
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('Meta token exchange failed:', tokenData);
      return NextResponse.redirect(
        new URL('/settings?error=token_exchange_failed', req.url)
      );
    }

    // Get long-lived token
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${tokenData.access_token}`
    );
    const longTokenData = await longTokenRes.json();
    const accessToken = longTokenData.access_token || tokenData.access_token;

    // Get user's pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`
    );
    const pagesData = await pagesRes.json();
    console.log('DEBUG_META_PAGES:', JSON.stringify(pagesData, null, 2));
    const page = pagesData.data?.[0]; // Use first page

    // Get Instagram Business Account
    let instagramBusinessId = null;
    if (page) {
      const igRes = await fetch(
        `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
      );
      const igData = await igRes.json();
      instagramBusinessId = igData.instagram_business_account?.id || null;
    }

    // Encrypt the tokens before saving
    const encryptedAccessToken = encryptToken(page?.access_token || accessToken);

    // Save to database
    await prisma.socialAccount.upsert({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: 'META',
        },
      },
      update: {
        accessToken: encryptedAccessToken,
        refreshToken: null,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // ~60 days
        accountName: page?.name || 'Meta Account',
        pageId: page?.id || null,
        instagramBusinessId,
      },
      create: {
        userId: session.user.id,
        workspaceId: (session.user as any).workspaceId,
        provider: 'META',
        accessToken: encryptedAccessToken,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        accountName: page?.name || 'Meta Account',
        pageId: page?.id || null,
        instagramBusinessId,
      },
    });

    return NextResponse.redirect(
      new URL('/settings?success=meta', req.url)
    );
  } catch (error: any) {
    console.error('Meta callback error:', error);
    return NextResponse.redirect(
      new URL('/settings?error=meta_callback_error', req.url)
    );
  }
}
