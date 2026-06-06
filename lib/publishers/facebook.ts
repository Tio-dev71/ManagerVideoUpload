import type { Publisher, PublishResult } from './types';
import type { Post, VideoAsset, SocialAccount, PostPlatform } from '@prisma/client';
import { getStorage } from '@/lib/storage';
import { decryptToken } from '@/lib/crypto';
import fs from 'fs';
import path from 'path';

const META_GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || 'v25.0';

/**
 * Facebook Reels publisher using Meta Graph API.
 * 
 * Flow:
 * 1. Upload video to Facebook Page via resumable upload
 * 2. Create reel with video
 * 
 * Required permissions: pages_manage_posts, pages_read_engagement
 * Required SocialAccount fields: pageId, accessToken
 */
export class FacebookReelsPublisher implements Publisher {
  async publishReel(
    post: Post,
    videoAsset: VideoAsset,
    socialAccount: SocialAccount,
    _platform: PostPlatform
  ): Promise<PublishResult> {
    try {
      if (!socialAccount.pageId) {
        return { success: false, errorMessage: 'No Facebook Page ID configured' };
      }

      const accessToken = decryptToken(socialAccount.accessToken);
      const storage = getStorage();
      const videoPath = storage.getPath(videoAsset.storageUrl);

      // Step 1: Initialize upload session
      const initRes = await fetch(
        `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${socialAccount.pageId}/video_reels`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            upload_phase: 'start',
            access_token: accessToken,
          }),
        }
      );

      const initData = await initRes.json();
      if (!initData.video_id) {
        return { success: false, errorMessage: `Failed to init upload: ${JSON.stringify(initData)}` };
      }

      const videoId = initData.video_id;

      // Step 2: Upload video binary
      const videoBuffer = fs.readFileSync(videoPath);
      const uploadRes = await fetch(
        `https://rupload.facebook.com/video-upload/${META_GRAPH_API_VERSION}/${videoId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `OAuth ${accessToken}`,
            offset: '0',
            file_size: videoBuffer.length.toString(),
            'Content-Type': 'application/octet-stream',
          },
          body: videoBuffer,
        }
      );

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        return { success: false, errorMessage: `Upload failed: ${JSON.stringify(uploadData)}` };
      }

      // Step 3: Publish reel
      const description = [post.caption, post.hashtags].filter(Boolean).join('\n\n');
      const publishRes = await fetch(
        `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${socialAccount.pageId}/video_reels`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            upload_phase: 'finish',
            video_id: videoId,
            video_state: 'PUBLISHED',
            title: post.title,
            description,
            access_token: accessToken,
          }),
        }
      );

      const publishData = await publishRes.json();
      if (publishData.success) {
        // Step 4: Post first comment if provided
        if (post.firstComment) {
          try {
            await fetch(`https://graph.facebook.com/${META_GRAPH_API_VERSION}/${videoId}/comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: post.firstComment,
                access_token: accessToken,
              }),
            });
          } catch (commentError) {
            console.error('Failed to post Facebook first comment:', commentError);
          }
        }
        return { success: true, externalPostId: videoId };
      }

      return { success: false, errorMessage: `Publish failed: ${JSON.stringify(publishData)}` };
    } catch (error: any) {
      return { success: false, errorMessage: `Facebook Reels error: ${error.message}` };
    }
  }
}
