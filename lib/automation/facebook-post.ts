import { chromium } from 'playwright';
import path from 'path';
import os from 'os';

export async function postToFacebookGroup(groupUrl: string, caption: string, videoPath: string, profileId: string = 'chrome-profile') {
  const userDataDir = path.join(os.homedir(), '.autopost', 'profiles', profileId);

  console.log(`[AutoPost] Starting Facebook automation...`);
  console.log(`[AutoPost] Launching Chromium with profile: ${userDataDir}`);
  
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: ['--disable-notifications', '--start-maximized'],
    viewport: null,
  });

  const page = await browser.newPage();

  try {
    console.log(`[AutoPost] Navigating to ${groupUrl}`);
    await page.goto(groupUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const cookies = await browser.cookies();
    const hasCUser = cookies.some(c => c.name === 'c_user');
    
    if (!hasCUser) {
      console.log(`[AutoPost] Not logged in to Facebook. Please log in manually.`);
      let isLoggedIn = false;
      for (let i = 0; i < 60; i++) {
        await page.waitForTimeout(5000);
        const currentCookies = await browser.cookies();
        if (currentCookies.some(c => c.name === 'c_user')) {
          isLoggedIn = true;
          break;
        }
      }

      if (!isLoggedIn) {
        throw new Error('Timeout: User did not log in to Facebook within 5 minutes.');
      }
      console.log(`[AutoPost] Login detected. Proceeding...`);
      await page.goto(groupUrl, { waitUntil: 'domcontentloaded' });
    }

    console.log(`[AutoPost] Clicking "Write something..."`);
    const writePostBox = page.locator('div[role="button"]:has-text("Write something"), div[role="button"]:has-text("Viết gì đó"), div[role="button"]:has-text("Create a public post"), div[role="button"]:has-text("Tạo bài viết")').first();
    await writePostBox.waitFor({ state: 'visible', timeout: 30000 });
    await writePostBox.click();

    console.log(`[AutoPost] Waiting for post modal...`);
    // Find the CORRECT dialog by filtering text inside it
    const dialog = page.locator('div[role="dialog"]').filter({ hasText: /(Add to your post|Thêm vào bài viết|Write something|Viết gì đó|Create post|Tạo bài viết)/ }).first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(2000);

    console.log(`[AutoPost] Uploading video: ${videoPath}`);
    
    // Listen for the filechooser BEFORE clicking the Photo/Video button
    const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 15000 }).catch(() => null);

    let clicked = false;
    const photoVideoSelectors = [
      '[aria-label="Photo/video"]',
      '[aria-label="Photo/Video"]', 
      '[aria-label="Ảnh/video"]',
      '[aria-label="Ảnh/Video"]',
      '[aria-label="Photo/video "]',
    ];

    // Try clicking the specific Photo/Video icon inside the dialog
    for (const sel of photoVideoSelectors) {
      const btn = dialog.locator(sel).first();
      if (await btn.count() > 0) {
        try {
          await btn.click({ force: true, timeout: 5000 });
          clicked = true;
          console.log(`[AutoPost] Clicked Photo/Video button with selector: ${sel}`);
          break;
        } catch (e) {
          // ignore
        }
      }
    }

    if (!clicked) {
      // Fallback: Click any button in the "Add to your post" row
      const addToPostRow = dialog.locator('div:has-text("Add to your post"), div:has-text("Thêm vào bài viết")').last();
      if (await addToPostRow.count() > 0) {
        const icons = addToPostRow.locator('div[role="button"], [aria-label]');
        if (await icons.count() > 0) {
          await icons.first().click({ force: true, timeout: 5000 }).catch(() => {});
          clicked = true;
          console.log(`[AutoPost] Clicked generic icon in Add to post row`);
        }
      }
    }

    let uploaded = false;
    if (clicked) {
      const fileChooser = await fileChooserPromise;
      if (fileChooser) {
        await fileChooser.setFiles(videoPath);
        uploaded = true;
        console.log(`[AutoPost] Video file set via file chooser`);
      } else {
        console.log(`[AutoPost] File chooser did not appear after clicking`);
      }
    }

    // Fallback if filechooser fails: Find the LAST hidden file input (which is usually the one for the dialog)
    if (!uploaded) {
      console.log(`[AutoPost] Trying fallback: direct hidden input...`);
      const fileInputs = page.locator('input[type="file"]');
      const count = await fileInputs.count();
      // Go backwards (from last to first) because the modal's input is appended last in the DOM
      for (let i = count - 1; i >= 0; i--) {
        const input = fileInputs.nth(i);
        const accept = await input.getAttribute('accept');
        if (accept && (accept.includes('video') || accept.includes('image'))) {
          await input.setInputFiles(videoPath);
          uploaded = true;
          console.log(`[AutoPost] Uploaded via fallback hidden input index ${i}`);
          break;
        }
      }
    }

    if (!uploaded) {
      throw new Error('Could not find any way to upload the video file.');
    }

    console.log(`[AutoPost] Video file submitted, waiting for Facebook to process...`);
    await page.waitForTimeout(5000);

    console.log(`[AutoPost] Entering caption...`);
    const textboxSelectors = [
      'div[role="textbox"][contenteditable="true"]',
      'div[contenteditable="true"][data-lexical-editor="true"]',
    ];

    let textbox;
    for (const sel of textboxSelectors) {
      // Find textbox INSIDE the specific dialog
      const candidate = dialog.locator(sel).first();
      try {
        await candidate.waitFor({ state: 'visible', timeout: 5000 });
        textbox = candidate;
        console.log(`[AutoPost] Found textbox with selector: ${sel}`);
        break;
      } catch {
        // try next
      }
    }

    if (!textbox) {
      throw new Error('Could not find the caption textbox after uploading video.');
    }

    await textbox.click({ force: true });
    await page.waitForTimeout(500);
    await page.keyboard.type(caption, { delay: 30 });

    console.log(`[AutoPost] Waiting for video to process before posting...`);
    await page.waitForTimeout(8000); 

    console.log(`[AutoPost] Clicking Post button...`);
    const postButtonSelectors = [
      'div[aria-label="Post"]',
      'div[aria-label="Đăng"]',
      'div[role="button"]:text-is("Post")',
      'div[role="button"]:text-is("Đăng")',
      'span:text-is("Post")',
      'span:text-is("Đăng")',
    ];

    let postClicked = false;
    for (const sel of postButtonSelectors) {
      // Find post button INSIDE the specific dialog
      const btn = dialog.locator(sel).first();
      try {
        await btn.waitFor({ state: 'visible', timeout: 3000 });
        await btn.click({ force: true });
        postClicked = true;
        console.log(`[AutoPost] Clicked Post button with selector: ${sel}`);
        break;
      } catch {
        // try next
      }
    }

    if (!postClicked) {
      throw new Error('Could not find the Post/Đăng button.');
    }

    console.log(`[AutoPost] Waiting for post to finish...`);
    await page.waitForTimeout(10000);
    
    // Log to DB
    try {
      const { prisma } = require('@/lib/db');
      await prisma.automationLog.create({
        data: {
          profileId,
          actionType: 'POST_GROUP',
          link: groupUrl,
          message: caption
        }
      });
    } catch (e) {
      console.error('[DB] Failed to log post:', e);
    }

    console.log(`[AutoPost] Successfully posted!`);

  } catch (error) {
    console.error(`[AutoPost] Error during automation:`, error);
    throw error;
  } finally {
    await page.waitForTimeout(5000);
    await browser.close();
  }
}
