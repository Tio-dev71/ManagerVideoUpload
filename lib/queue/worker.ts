import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { getPublisher } from '../publishers';

const prisma = new PrismaClient();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

async function processPublishJob(job: Job<{ postId: string }>) {
  const { postId } = job.data;
  console.log(`🚀 Processing publish job for post: ${postId}`);

  // Get post with all relations
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      videoAsset: true,
      platforms: true,
      createdBy: {
        include: {
          socialAccounts: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error(`Post not found: ${postId}`);
  }

  // Update post status to PUBLISHING
  await prisma.post.update({
    where: { id: postId },
    data: { status: 'PUBLISHING' },
  });

  let allSuccess = true;
  let anySuccess = false;

  // Process each platform
  for (const postPlatform of post.platforms) {
    // Update platform status
    await prisma.postPlatform.update({
      where: { id: postPlatform.id },
      data: { status: 'PUBLISHING' },
    });

    // Log start
    await prisma.publishLog.create({
      data: {
        postId,
        platform: postPlatform.platform,
        level: 'INFO',
        message: `Starting publish to ${postPlatform.platform}`,
      },
    });

    // Find matching social account (using ADMIN's connected account)
    const providerMap: Record<string, string> = {
      FACEBOOK_REELS: 'META',
      INSTAGRAM_REELS: 'META',
      YOUTUBE_SHORTS: 'YOUTUBE',
    };
    
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        workspaceId: post.workspaceId,
        provider: providerMap[postPlatform.platform] as any,
      },
    });

    if (!socialAccount) {
      await prisma.postPlatform.update({
        where: { id: postPlatform.id },
        data: {
          status: 'FAILED',
          errorMessage: `No ${providerMap[postPlatform.platform]} account connected`,
        },
      });
      await prisma.publishLog.create({
        data: {
          postId,
          platform: postPlatform.platform,
          level: 'ERROR',
          message: `No ${providerMap[postPlatform.platform]} account connected. Please connect your account in Settings.`,
        },
      });
      allSuccess = false;
      continue;
    }

    // Publish
    try {
      const publisher = getPublisher(postPlatform.platform);
      const result = await publisher.publishReel(post, post.videoAsset, socialAccount, postPlatform);

      if (result.success) {
        await prisma.postPlatform.update({
          where: { id: postPlatform.id },
          data: {
            status: 'PUBLISHED',
            externalPostId: result.externalPostId,
          },
        });
        await prisma.publishLog.create({
          data: {
            postId,
            platform: postPlatform.platform,
            level: 'INFO',
            message: `Successfully published to ${postPlatform.platform}`,
            metadata: { externalPostId: result.externalPostId },
          },
        });
        anySuccess = true;
      } else {
        await prisma.postPlatform.update({
          where: { id: postPlatform.id },
          data: {
            status: 'FAILED',
            errorMessage: result.errorMessage,
          },
        });
        await prisma.publishLog.create({
          data: {
            postId,
            platform: postPlatform.platform,
            level: 'ERROR',
            message: result.errorMessage || 'Unknown error',
          },
        });
        allSuccess = false;
      }
    } catch (error: any) {
      await prisma.postPlatform.update({
        where: { id: postPlatform.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });
      await prisma.publishLog.create({
        data: {
          postId,
          platform: postPlatform.platform,
          level: 'ERROR',
          message: `Unexpected error: ${error.message}`,
          metadata: { stack: error.stack },
        },
      });
      allSuccess = false;
    }
  }

  // Update final post status
  let finalStatus: 'PUBLISHED' | 'FAILED' | 'PARTIAL_FAILED';
  if (allSuccess) {
    finalStatus = 'PUBLISHED';
  } else if (anySuccess) {
    finalStatus = 'PARTIAL_FAILED';
  } else {
    finalStatus = 'FAILED';
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      status: finalStatus,
      publishedAt: anySuccess ? new Date() : undefined,
    },
  });

  console.log(`📋 Post ${postId} final status: ${finalStatus}`);
}

export function startWorker() {
  const worker = new Worker('publish-reel', processPublishJob, {
    connection: connection as any,
    concurrency: 2,
  });

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
  });

  console.log('🔄 Publish worker started');
  return worker;
}
