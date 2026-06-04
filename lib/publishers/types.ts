import type { Post, VideoAsset, SocialAccount, PostPlatform } from '@prisma/client';

export interface PublishResult {
  success: boolean;
  externalPostId?: string;
  errorMessage?: string;
}

export interface Publisher {
  publishReel(
    post: Post,
    videoAsset: VideoAsset,
    socialAccount: SocialAccount,
    platform: PostPlatform
  ): Promise<PublishResult>;
}
