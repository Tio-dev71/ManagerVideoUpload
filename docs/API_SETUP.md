# API Setup Guide

This guide explains how to set up real API credentials for publishing to Facebook Reels, Instagram Reels, and YouTube Shorts.

> **For development**, you can skip this and use `USE_MOCK_PUBLISHERS=true` in `.env`.

---

## 1. Meta (Facebook + Instagram)

### Create Meta App

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** as app type
4. Fill in app name (e.g., "AutoReel Lite")
5. Select or create a Business Portfolio

### Add Required Products

In your app dashboard, add these products:
- **Facebook Login for Business**
- **Instagram Graph API**

### Configure Permissions

Go to **App Review** → **Permissions and Features** and request:
- `pages_manage_posts` — Post to Facebook Pages
- `pages_read_engagement` — Read page info
- `pages_show_list` — List user's pages
- `instagram_basic` — Read Instagram account info
- `instagram_content_publish` — Publish to Instagram

### Set Redirect URI

Go to **Facebook Login** → **Settings** → **Valid OAuth Redirect URIs**:
```
http://localhost:3000/api/social/meta/callback
```

### Get Credentials

Go to **Settings** → **Basic**:
- **App ID** → `META_APP_ID`
- **App Secret** → `META_APP_SECRET`

### Update `.env`

```env
META_APP_ID=your-app-id
META_APP_SECRET=your-app-secret
META_REDIRECT_URI=http://localhost:3000/api/social/meta/callback
```

### Important Notes

- Your Facebook Page must be linked to your app
- Instagram publishing requires an **Instagram Business** or **Creator Account** connected to a Facebook Page
- Tokens expire after ~60 days — the app will prompt to reconnect

---

## 2. Google (YouTube + Drive)

### Create Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (e.g., "AutoReel Lite")
3. Select the project

### Enable APIs

Go to **APIs & Services** → **Library** and enable:
- **YouTube Data API v3** — For YouTube Shorts publishing
- **Google Drive API** — For importing videos from Drive

### Configure OAuth Consent Screen

Go to **APIs & Services** → **OAuth consent screen**:

1. Choose **External** user type
2. Fill in:
   - App name: "AutoReel Lite"
   - User support email: your email
   - Developer contact: your email
3. Add scopes:
   - `https://www.googleapis.com/auth/youtube.upload`
   - `https://www.googleapis.com/auth/youtube.readonly`
   - `https://www.googleapis.com/auth/drive.readonly`
4. Add test users (your email)

### Create OAuth Credentials

Go to **APIs & Services** → **Credentials**:

1. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
2. Application type: **Web application**
3. Name: "AutoReel Lite"
4. Authorized redirect URIs:
   ```
   http://localhost:3000/api/social/google/callback
   ```
5. Click **Create**

### Get Credentials

- **Client ID** → `GOOGLE_CLIENT_ID`
- **Client Secret** → `GOOGLE_CLIENT_SECRET`

### Update `.env`

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/social/google/callback
```

### Important Notes

- While in "Testing" mode, only test users can authenticate
- YouTube Shorts are regular YouTube videos — adding `#Shorts` to the title and using vertical video (9:16) makes YouTube classify them as Shorts
- Google tokens expire after 1 hour — the app uses refresh tokens for long-term access
- YouTube upload quota is limited — check your [quota dashboard](https://console.cloud.google.com/apis/dashboard)

---

## 3. Production Deployment

### Token Encryption

For production, update `TOKEN_ENCRYPTION_KEY` in `.env` with a strong key:

```bash
openssl rand -hex 16
```

### HTTPS Required

OAuth redirects require HTTPS in production. Update redirect URIs:
```
https://yourdomain.com/api/social/meta/callback
https://yourdomain.com/api/social/google/callback
```

### Meta App Review

Before going live, submit your Meta app for review:
1. Complete all required fields in App Dashboard
2. Provide detailed use case descriptions
3. Record a screencast demo
4. Submit for review (typically takes 1-5 business days)

### YouTube Quota

Default YouTube API quota is 10,000 units/day. Video uploads cost ~1,600 units each.
- Request quota increase at [Google API Console](https://console.cloud.google.com/apis/dashboard)

---

## Troubleshooting

### "Token expired" error
Reconnect the account in Settings page.

### Instagram "Container Error"
- Ensure your Instagram account is a Business or Creator account
- Ensure it's connected to a Facebook Page
- Video must be publicly accessible URL (not localhost)

### YouTube "quotaExceeded"
You've hit the daily quota limit. Wait 24h or request increase.

### Facebook "OAuthException"
- Check that your app has the required permissions
- Ensure the Page token hasn't expired
- Verify the Page is published (not unpublished/draft)
