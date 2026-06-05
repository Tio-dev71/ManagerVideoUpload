"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// lib/queue/worker.ts
var import_bullmq = require("bullmq");
var import_ioredis = __toESM(require("ioredis"));
var import_client = require("@prisma/client");

// lib/publishers/mock.ts
var MockPublisher = class {
  constructor(platformName) {
    this.platformName = platformName;
  }
  async publishReel(post, _videoAsset, _socialAccount, _platform) {
    console.log(`[MOCK] Publishing "${post.title}" to ${this.platformName}...`);
    await new Promise((resolve) => setTimeout(resolve, 3e3));
    const isSuccess = Math.random() > 0.1;
    if (isSuccess) {
      const mockId = `mock_${this.platformName.toLowerCase()}_${Date.now()}`;
      console.log(`[MOCK] \u2705 Published to ${this.platformName}: ${mockId}`);
      return {
        success: true,
        externalPostId: mockId
      };
    } else {
      const errorMsg = `[MOCK] Simulated failure for ${this.platformName}: API rate limit exceeded`;
      console.log(`[MOCK] \u274C ${errorMsg}`);
      return {
        success: false,
        errorMessage: errorMsg
      };
    }
  }
};

// lib/storage/index.ts
var import_promises = __toESM(require("fs/promises"));
var import_path = __toESM(require("path"));
var import_uuid = require("uuid");
var LocalStorageAdapter = class {
  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || "./uploads";
  }
  async upload(file, filename) {
    await import_promises.default.mkdir(this.uploadDir, { recursive: true });
    const ext = import_path.default.extname(filename);
    const uniqueName = `${(0, import_uuid.v4)()}${ext}`;
    const filePath = import_path.default.join(this.uploadDir, uniqueName);
    await import_promises.default.writeFile(filePath, file);
    return `/api/uploads/${uniqueName}`;
  }
  async delete(url) {
    const filename = url.replace("/api/uploads/", "");
    const filePath = import_path.default.join(this.uploadDir, filename);
    try {
      await import_promises.default.unlink(filePath);
    } catch {
    }
  }
  getPath(url) {
    const filename = url.replace("/api/uploads/", "");
    return import_path.default.join(this.uploadDir, filename);
  }
};
var storageInstance = null;
function getStorage() {
  if (!storageInstance) {
    storageInstance = new LocalStorageAdapter();
  }
  return storageInstance;
}

// lib/crypto.ts
var import_crypto = __toESM(require("crypto"));
var ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || "0123456789abcdef0123456789abcdef";
var ALGORITHM = "aes-256-gcm";
function decryptToken(encryptedText) {
  if (!encryptedText) return encryptedText;
  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 3) return encryptedText;
    const [ivHex, authTagHex, encryptedData] = parts;
    const decipher = import_crypto.default.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, "utf-8"),
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt token:", error);
    return encryptedText;
  }
}

// lib/publishers/facebook.ts
var import_fs = __toESM(require("fs"));
var FacebookReelsPublisher = class {
  async publishReel(post, videoAsset, socialAccount, _platform) {
    try {
      if (!socialAccount.pageId) {
        return { success: false, errorMessage: "No Facebook Page ID configured" };
      }
      const accessToken = decryptToken(socialAccount.accessToken);
      const storage = getStorage();
      const videoPath = storage.getPath(videoAsset.storageUrl);
      const initRes = await fetch(
        `https://graph.facebook.com/v19.0/${socialAccount.pageId}/video_reels`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            upload_phase: "start",
            access_token: accessToken
          })
        }
      );
      const initData = await initRes.json();
      if (!initData.video_id) {
        return { success: false, errorMessage: `Failed to init upload: ${JSON.stringify(initData)}` };
      }
      const videoId = initData.video_id;
      const videoBuffer = import_fs.default.readFileSync(videoPath);
      const uploadRes = await fetch(
        `https://rupload.facebook.com/video-upload/v19.0/${videoId}`,
        {
          method: "POST",
          headers: {
            Authorization: `OAuth ${accessToken}`,
            offset: "0",
            file_size: videoBuffer.length.toString(),
            "Content-Type": "application/octet-stream"
          },
          body: videoBuffer
        }
      );
      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        return { success: false, errorMessage: `Upload failed: ${JSON.stringify(uploadData)}` };
      }
      const description = [post.caption, post.hashtags].filter(Boolean).join("\n\n");
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${socialAccount.pageId}/video_reels`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            upload_phase: "finish",
            video_id: videoId,
            title: post.title,
            description,
            access_token: accessToken
          })
        }
      );
      const publishData = await publishRes.json();
      if (publishData.success) {
        if (post.firstComment) {
          try {
            await fetch(`https://graph.facebook.com/v19.0/${videoId}/comments`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: post.firstComment,
                access_token: accessToken
              })
            });
          } catch (commentError) {
            console.error("Failed to post Facebook first comment:", commentError);
          }
        }
        return { success: true, externalPostId: videoId };
      }
      return { success: false, errorMessage: `Publish failed: ${JSON.stringify(publishData)}` };
    } catch (error) {
      return { success: false, errorMessage: `Facebook Reels error: ${error.message}` };
    }
  }
};

// lib/publishers/instagram.ts
var InstagramReelsPublisher = class {
  async publishReel(post, videoAsset, socialAccount, _platform) {
    try {
      if (!socialAccount.instagramBusinessId) {
        return { success: false, errorMessage: "No Instagram Business ID configured" };
      }
      const igId = socialAccount.instagramBusinessId;
      const token = decryptToken(socialAccount.accessToken);
      const videoUrl = videoAsset.storageUrl;
      const caption = [post.caption, post.hashtags].filter(Boolean).join("\n\n");
      const containerRes = await fetch(
        `https://graph.facebook.com/v19.0/${igId}/media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            media_type: "REELS",
            video_url: videoUrl,
            caption,
            access_token: token
          })
        }
      );
      const containerData = await containerRes.json();
      if (!containerData.id) {
        return { success: false, errorMessage: `Container creation failed: ${JSON.stringify(containerData)}` };
      }
      const containerId = containerData.id;
      let retries = 30;
      while (retries > 0) {
        await new Promise((r) => setTimeout(r, 1e4));
        const statusRes = await fetch(
          `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${token}`
        );
        const statusData = await statusRes.json();
        if (statusData.status_code === "FINISHED") break;
        if (statusData.status_code === "ERROR") {
          return { success: false, errorMessage: `Video processing failed: ${JSON.stringify(statusData)}` };
        }
        retries--;
      }
      if (retries === 0) {
        return { success: false, errorMessage: "Video processing timed out" };
      }
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${igId}/media_publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creation_id: containerId,
            access_token: token
          })
        }
      );
      const publishData = await publishRes.json();
      if (publishData.id) {
        if (post.firstComment) {
          try {
            await fetch(`https://graph.facebook.com/v19.0/${publishData.id}/comments`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: post.firstComment,
                access_token: token
              })
            });
          } catch (commentError) {
            console.error("Failed to post Instagram first comment:", commentError);
          }
        }
        return { success: true, externalPostId: publishData.id };
      }
      return { success: false, errorMessage: `Publish failed: ${JSON.stringify(publishData)}` };
    } catch (error) {
      return { success: false, errorMessage: `Instagram Reels error: ${error.message}` };
    }
  }
};

// lib/publishers/youtube.ts
var import_fs2 = __toESM(require("fs"));
var YouTubeShortsPublisher = class {
  async publishReel(post, videoAsset, socialAccount, _platform) {
    try {
      const token = decryptToken(socialAccount.accessToken);
      const storage = getStorage();
      const videoPath = storage.getPath(videoAsset.storageUrl);
      let title = post.title;
      if (!title.toLowerCase().includes("#shorts")) {
        title = `${title} #Shorts`;
      }
      const description = [post.caption, post.hashtags].filter(Boolean).join("\n\n");
      const initRes = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            snippet: {
              title,
              description,
              categoryId: "22"
              // People & Blogs
            },
            status: {
              privacyStatus: "public",
              selfDeclaredMadeForKids: false
            }
          })
        }
      );
      const uploadUrl = initRes.headers.get("location");
      if (!uploadUrl) {
        return { success: false, errorMessage: `Failed to init upload: ${initRes.status} ${initRes.statusText}` };
      }
      const videoBuffer = import_fs2.default.readFileSync(videoPath);
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": videoAsset.mimeType,
          "Content-Length": videoBuffer.length.toString()
        },
        body: videoBuffer
      });
      const uploadData = await uploadRes.json();
      if (uploadData.id) {
        if (post.firstComment) {
          try {
            await fetch("https://www.googleapis.com/youtube/v3/commentThreads?part=snippet", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                snippet: {
                  videoId: uploadData.id,
                  topLevelComment: {
                    snippet: {
                      textOriginal: post.firstComment
                    }
                  }
                }
              })
            });
          } catch (commentError) {
            console.error("Failed to post YouTube first comment:", commentError);
          }
        }
        return { success: true, externalPostId: uploadData.id };
      }
      return { success: false, errorMessage: `Upload failed: ${JSON.stringify(uploadData)}` };
    } catch (error) {
      return { success: false, errorMessage: `YouTube Shorts error: ${error.message}` };
    }
  }
};

// lib/publishers/index.ts
var useMock = process.env.USE_MOCK_PUBLISHERS === "true";
function getPublisher(platform) {
  if (useMock) {
    return new MockPublisher(platform);
  }
  switch (platform) {
    case "FACEBOOK_REELS":
      return new FacebookReelsPublisher();
    case "INSTAGRAM_REELS":
      return new InstagramReelsPublisher();
    case "YOUTUBE_SHORTS":
      return new YouTubeShortsPublisher();
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}

// lib/queue/worker.ts
var prisma = new import_client.PrismaClient();
var connection = new import_ioredis.default(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null
});
async function processPublishJob(job) {
  const { postId } = job.data;
  console.log(`\u{1F680} Processing publish job for post: ${postId}`);
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      videoAsset: true,
      platforms: true,
      createdBy: {
        include: {
          socialAccounts: true
        }
      }
    }
  });
  if (!post) {
    throw new Error(`Post not found: ${postId}`);
  }
  await prisma.post.update({
    where: { id: postId },
    data: { status: "PUBLISHING" }
  });
  let allSuccess = true;
  let anySuccess = false;
  for (const postPlatform of post.platforms) {
    await prisma.postPlatform.update({
      where: { id: postPlatform.id },
      data: { status: "PUBLISHING" }
    });
    await prisma.publishLog.create({
      data: {
        postId,
        platform: postPlatform.platform,
        level: "INFO",
        message: `Starting publish to ${postPlatform.platform}`
      }
    });
    const providerMap = {
      FACEBOOK_REELS: "META",
      INSTAGRAM_REELS: "META",
      YOUTUBE_SHORTS: "YOUTUBE"
    };
    let adminUserId = post.createdById;
    if (post.createdBy.role === "STAFF") {
      const allowedEmail = await prisma.allowedEmail.findUnique({
        where: { email: post.createdBy.email }
      });
      if (allowedEmail) {
        adminUserId = allowedEmail.invitedById;
      }
    }
    const socialAccount = await prisma.socialAccount.findUnique({
      where: {
        userId_provider: {
          userId: adminUserId,
          provider: providerMap[postPlatform.platform]
        }
      }
    });
    if (!socialAccount) {
      await prisma.postPlatform.update({
        where: { id: postPlatform.id },
        data: {
          status: "FAILED",
          errorMessage: `No ${providerMap[postPlatform.platform]} account connected`
        }
      });
      await prisma.publishLog.create({
        data: {
          postId,
          platform: postPlatform.platform,
          level: "ERROR",
          message: `No ${providerMap[postPlatform.platform]} account connected. Please connect your account in Settings.`
        }
      });
      allSuccess = false;
      continue;
    }
    try {
      const publisher = getPublisher(postPlatform.platform);
      const result = await publisher.publishReel(post, post.videoAsset, socialAccount, postPlatform);
      if (result.success) {
        await prisma.postPlatform.update({
          where: { id: postPlatform.id },
          data: {
            status: "PUBLISHED",
            externalPostId: result.externalPostId
          }
        });
        await prisma.publishLog.create({
          data: {
            postId,
            platform: postPlatform.platform,
            level: "INFO",
            message: `Successfully published to ${postPlatform.platform}`,
            metadata: { externalPostId: result.externalPostId }
          }
        });
        anySuccess = true;
      } else {
        await prisma.postPlatform.update({
          where: { id: postPlatform.id },
          data: {
            status: "FAILED",
            errorMessage: result.errorMessage
          }
        });
        await prisma.publishLog.create({
          data: {
            postId,
            platform: postPlatform.platform,
            level: "ERROR",
            message: result.errorMessage || "Unknown error"
          }
        });
        allSuccess = false;
      }
    } catch (error) {
      await prisma.postPlatform.update({
        where: { id: postPlatform.id },
        data: {
          status: "FAILED",
          errorMessage: error.message
        }
      });
      await prisma.publishLog.create({
        data: {
          postId,
          platform: postPlatform.platform,
          level: "ERROR",
          message: `Unexpected error: ${error.message}`,
          metadata: { stack: error.stack }
        }
      });
      allSuccess = false;
    }
  }
  let finalStatus;
  if (allSuccess) {
    finalStatus = "PUBLISHED";
  } else if (anySuccess) {
    finalStatus = "PARTIAL_FAILED";
  } else {
    finalStatus = "FAILED";
  }
  await prisma.post.update({
    where: { id: postId },
    data: {
      status: finalStatus,
      publishedAt: anySuccess ? /* @__PURE__ */ new Date() : void 0
    }
  });
  console.log(`\u{1F4CB} Post ${postId} final status: ${finalStatus}`);
}
function startWorker() {
  const worker = new import_bullmq.Worker("publish-reel", processPublishJob, {
    connection,
    concurrency: 2
  });
  worker.on("completed", (job) => {
    console.log(`\u2705 Job ${job.id} completed`);
  });
  worker.on("failed", (job, err) => {
    console.error(`\u274C Job ${job?.id} failed:`, err.message);
  });
  console.log("\u{1F504} Publish worker started");
  return worker;
}

// worker.ts
console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
console.log("  AutoReel Lite \u2014 Queue Worker");
console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
startWorker();
process.on("SIGTERM", () => {
  console.log("Worker shutting down...");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("Worker shutting down...");
  process.exit(0);
});
