import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { getStorage } from '@/lib/storage';
import { titleFromFilename, isAllowedVideoType, getMaxFileSize } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    // Validate file type
    if (!isAllowedVideoType(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: MP4, MOV, WebM' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = getMaxFileSize();
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Upload file
    const storage = getStorage();
    const buffer = Buffer.from(await file.arrayBuffer());
    const storageUrl = await storage.upload(buffer, file.name);

    // Generate title from filename
    const title = titleFromFilename(file.name);

    // Create video asset record
    const videoAsset = await prisma.videoAsset.create({
      data: {
        originalFileName: file.name,
        titleFromFileName: title,
        storageUrl,
        source: 'LOCAL_UPLOAD',
        mimeType: file.type,
        size: file.size,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(videoAsset, { status: 201 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
