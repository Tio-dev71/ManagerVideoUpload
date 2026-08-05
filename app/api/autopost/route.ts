import { NextRequest, NextResponse } from 'next/server';
import { addWatermark } from '@/lib/video/watermark';
import { postToFacebookGroup } from '@/lib/automation/facebook-post';
import { prisma } from '@/lib/db';
import fs from 'fs';

export async function POST(req: NextRequest) {
  let videoPath = '';
  
  try {
    const body = await req.json();
    const { videoUrl, groupUrl, caption, watermarkText, accountIds } = body;

    if (!videoUrl || !groupUrl) {
      return NextResponse.json({ error: 'videoUrl and groupUrl are required' }, { status: 400 });
    }
    
    let profilesToRun = ['chrome-profile']; // fallback
    if (accountIds && Array.isArray(accountIds) && accountIds.length > 0) {
      const accounts = await prisma.facebookAccount.findMany({
        where: { id: { in: accountIds } }
      });
      if (accounts.length > 0) {
        profilesToRun = accounts.map(a => a.profileId);
      }
    }

    console.log(`[API /autopost] Starting process for video: ${videoUrl}`);
    
    // Step 1: Add watermark
    videoPath = await addWatermark(videoUrl, watermarkText || 'Topmedia');

    // Step 2: Post to Facebook Group for each account sequentially
    console.log(`[API /autopost] Starting Facebook automation for ${profilesToRun.length} accounts...`);
    const results = [];
    
    for (const profileId of profilesToRun) {
      try {
        console.log(`[API /autopost] Running account profile: ${profileId}`);
        await postToFacebookGroup(groupUrl, caption || '', videoPath, profileId);
        results.push({ profileId, success: true });
      } catch (err: any) {
        console.error(`[API /autopost] Failed for profile ${profileId}:`, err);
        results.push({ profileId, success: false, error: err.message });
      }
    }

    return NextResponse.json({ success: true, message: 'Process completed', results });

  } catch (error: any) {
    console.error('[API /autopost] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process and post video', details: error.message },
      { status: 500 }
    );
  } finally {
    // Clean up watermarked video after posting
    if (videoPath && fs.existsSync(videoPath)) {
      try {
        fs.unlinkSync(videoPath);
      } catch (err) {
        console.error(`[API /autopost] Error cleaning up file ${videoPath}:`, err);
      }
    }
  }
}
