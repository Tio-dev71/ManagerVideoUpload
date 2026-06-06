import type { Publisher, PublishResult } from './types';
import type { Post, VideoAsset, SocialAccount, PostPlatform } from '@prisma/client';
import { getStorage } from '@/lib/storage';
import { decryptToken } from '@/lib/crypto';
import fs from 'fs';

/**
 * Instagram Reels publisher using Meta Graph API.
 * 
 * Flow:
 * 1. Create a media container with video URL
 * 2. Wait for processing
 * 3. Publish the container
 * 
 * Required permissions: instagram_content_publish, instagram_basic
 * Required SocialAccount fields: instagramBusinessId, accessToken
 */
export class InstagramReelsPublisher implements Publisher {
  async publishReel(
    post: Post,
    videoAsset: VideoAsset,
    socialAccount: SocialAccount,
    _platform: PostPlatform
  ): Promise<PublishResult> {
    try {
      if (!socialAccount.instagramBusinessId) {
        return { success: false, errorMessage: 'No Instagram Business ID configured' };
      }

      const igId = socialAccount.instagramBusinessId;
      const token = decryptToken(socialAccount.accessToken);

      // For Instagram, we need a publicly accessible URL for the video
      // In production, this would be an S3/CDN URL
      // For local dev, this needs to be tunneled (e.g., ngrok)
      const videoUrl = videoAsset.storageUrl;

      const caption = [post.caption, post.hashtags].filter(Boolean).join('\n\n');

      // Step 1: Create media container
      const containerRes = await fetch(
        `https://graph.facebook.com/v19.0/${igId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'REELS',
            video_url: videoUrl,
            caption,
            access_token: token,
          }),
        }
      );

      const containerData = await containerRes.json();
      if (!containerData.id) {
        return { success: false, errorMessage: `Container creation failed: ${JSON.stringify(containerData)}` };
      }

      const containerId = containerData.id;

      // Step 2: Poll for processing status
      let retries = 30; // max 5 minutes (10s intervals)
      while (retries > 0) {
        await new Promise((r) => setTimeout(r, 10000));

        const statusRes = await fetch(
          `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${token}`
        );
        const statusData = await statusRes.json();

        if (statusData.status_code === 'FINISHED') break;
        if (statusData.status_code === 'ERROR') {
          return { success: false, errorMessage: `Video processing failed: ${JSON.stringify(statusData)}` };
        }

        retries--;
      }

      if (retries === 0) {
        return { success: false, errorMessage: 'Video processing timed out' };
      }

      // Step 3: Publish
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${igId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerId,
            access_token: token,
          }),
        }
      );

      const publishData = await publishRes.json();
      if (publishData.id) {
        // Step 4: Post first comment if provided
        if (post.firstComment) {
          try {
            await fetch(`https://graph.facebook.com/v19.0/${publishData.id}/comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: post.firstComment,
                access_token: token,
              }),
            });
          } catch (commentError) {
            console.error('Failed to post Instagram first comment:', commentError);
          }
        }
        return { success: true, externalPostId: publishData.id };
      }

      return { success: false, errorMessage: `Publish failed: ${JSON.stringify(publishData)}` };
    } catch (error: any) {
      return { success: false, errorMessage: `Instagram Reels error: ${error.message}` };
    }
  }
}
