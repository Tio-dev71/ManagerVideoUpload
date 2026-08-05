import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
    
    if (!fs.existsSync(screenshotsDir)) {
      return NextResponse.json({ activeProfiles: [] });
    }

    const files = fs.readdirSync(screenshotsDir);
    const activeProfiles = files
      .filter(f => f.endsWith('.jpg'))
      .map(f => f.replace('.jpg', ''));

    return NextResponse.json({ activeProfiles });
  } catch (error) {
    console.error('Failed to get live profiles:', error);
    return NextResponse.json({ activeProfiles: [] });
  }
}
