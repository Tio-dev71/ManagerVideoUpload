import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

export const publishQueue = new Queue('publish-reel', {
  connection: connection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

/**
 * Add a post to the publish queue for immediate processing
 */
export async function enqueuePublish(postId: string) {
  await publishQueue.add('publish', { postId }, {
    jobId: `publish-${postId}`,
  });
}

/**
 * Add a post to the publish queue with a delay
 */
export async function schedulePublish(postId: string, scheduledAt: Date) {
  const delay = Math.max(0, scheduledAt.getTime() - Date.now());
  await publishQueue.add('publish', { postId }, {
    jobId: `publish-${postId}`,
    delay,
  });
}
