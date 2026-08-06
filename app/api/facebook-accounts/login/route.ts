import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { chromium } from 'playwright';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { TOTP } from 'totp-generator';
import { browserManager } from '@/lib/automation/browserManager';

export async function POST(req: NextRequest) {
  let browser;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const account = await prisma.facebookAccount.findUnique({ where: { id } });
    if (!account || !account.uid || !account.password) {
      return NextResponse.json({ error: 'Account, UID, or password not found' }, { status: 404 });
    }

    const userDataDir = path.join(os.homedir(), '.autopost', 'profiles', account.profileId);

    console.log(`[FB Login API] Starting login for UID: ${account.uid}`);

    try {
      browser = await browserManager.launchBrowser(account.profileId, account.proxy);
    } catch (launchError: any) {
      console.error('[FB Login API] Launch error:', launchError.message);
      return NextResponse.json({ success: false, error: launchError.message || 'Trình duyệt đang mở ở nơi khác!' }, { status: 400 });
    }

    // Wait a moment for Chrome to restore previous tabs
    await new Promise(r => setTimeout(r, 2000));

    let pages;
    try {
      pages = browser.pages();
    } catch (e) {
      // Browser is dead/stale, clear it and throw
      browserManager.removeBrowser(account.profileId);
      return NextResponse.json({ success: false, error: 'Trình duyệt bị ngắt kết nối đột ngột. Hãy thử lại!' }, { status: 500 });
    }

    let page = pages.find(p => p.url().includes('facebook.com'));

    if (!page) {
      page = pages[pages.length - 1];
    }

    // Close ALL other tabs to avoid about:blank or any other clutter
    for (const p of pages) {
      if (p !== page) {
        await p.close().catch(() => { });
      }
    }

    if (!page) {
      try {
        page = await browser.newPage();
      } catch (e) {
        browserManager.removeBrowser(account.profileId);
        return NextResponse.json({ success: false, error: 'Trình duyệt bị lỗi. Hãy thử lại!' }, { status: 500 });
      }
    }

    await page.bringToFront();
    await page.goto('https://www.facebook.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Check if already logged in
    const isLoggedIn = await page.evaluate(() => {
      return !!document.querySelector('div[role="navigation"]') || !!document.querySelector('form[action*="/search/"]');
    });

    // Helper to setup screenshot interval
    const setupLiveDashboard = () => {
      const screenshotPath = path.join(process.cwd(), 'public', 'screenshots', `${account.profileId}.jpg`);
      const intervalId = setInterval(() => {
        if (page.isClosed()) {
          clearInterval(intervalId);
          if (fs.existsSync(screenshotPath)) {
            try { fs.unlinkSync(screenshotPath); } catch (e) { }
          }
        } else {
          page.screenshot({ path: screenshotPath, type: 'jpeg', quality: 40 }).catch(() => { });
        }
      }, 2000);

      browser.on('disconnected', () => {
        clearInterval(intervalId);
        if (fs.existsSync(screenshotPath)) {
          try { fs.unlinkSync(screenshotPath); } catch (e) { }
        }
      });
    };

    if (isLoggedIn) {
      console.log(`[FB Login API] Already logged in.`);
      setupLiveDashboard();
      // Update status to LIVE
      await prisma.facebookAccount.update({ where: { id }, data: { status: 'LIVE' } });
      return NextResponse.json({ success: true, message: 'Already logged in (Browser left open)' });
    }

    // Fill credentials
    await page.fill('input[name="email"], #email', account.uid);
    await page.fill('input[name="pass"], #pass', account.password);

    await page.waitForTimeout(500);

    // Click login
    const loginBtn = page.locator('button[name="login"], button[type="submit"], [data-testid="royal_login_button"], input[type="submit"]');
    if (await loginBtn.count() > 0) {
      console.log('[FB Login API] Clicking login button...');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => { }),
        loginBtn.first().click({ force: true })
      ]);
    } else {
      console.log('[FB Login API] Login button not found. Assuming different UI or already logged in.');
    }

    await page.waitForTimeout(2000);

    // Check for login errors
    const loginError = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('không kết nối với tài khoản nào') ||
        text.includes('không chính xác') ||
        text.includes('incorrect') ||
        text.includes("isn't connected to an account");
    });

    if (loginError) {
      console.log(`[FB Login API] Login failed - Invalid credentials`);
      await browser.close();
      return NextResponse.json({ success: false, error: 'Invalid credentials or account disabled' }, { status: 400 });
    }

    // Check for 2FA
    const isTwoFactor = await page.evaluate(() => {
      return !!document.querySelector('#approvals_code') ||
        document.body.innerText.includes('two-factor authentication') ||
        document.body.innerText.includes('Nhập mã');
    });

    if (isTwoFactor) {
      if (!account.twoFactorCode) {
        console.log('[FB Login API] 2FA required but no secret provided.');
        await browser.close();
        return NextResponse.json({ success: false, error: '2FA required but no secret provided' }, { status: 400 });
      }

      console.log('[FB Login API] 2FA required. Generating token...');
      const token = TOTP.generate(account.twoFactorCode.replace(/\s+/g, '').toUpperCase()).otp;

      const codeInput = page.locator('#approvals_code');
      if (await codeInput.count() > 0) {
        await codeInput.fill(token);

        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => { }),
          page.locator('#checkpointSubmitButton').click({ force: true })
        ]);
        await page.waitForTimeout(2000);
      }
    }

    // Check for "Save Browser" prompt
    try {
      const saveBrowserBtn = page.locator('#checkpointSubmitButton, button[value="OK"], button[name="submit[Continue]"], button[type="submit"]');
      if (await saveBrowserBtn.count() > 0) {
        console.log('[FB Login API] Clicking Save Browser / Continue button...');
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => { }),
          saveBrowserBtn.first().click({ force: true })
        ]);
      }
    } catch (e) {
      // Ignore
    }

    console.log(`[FB Login API] Login flow completed for UID: ${account.uid}`);

    // Set up continuous screenshot for Live Dashboard if they left it open
    setupLiveDashboard();

    // Update status to LIVE
    await prisma.facebookAccount.update({
      where: { id },
      data: { status: 'LIVE' }
    });

    // We do NOT close the browser here so the user can continue using it 24/7
    return NextResponse.json({ success: true, message: 'Login successful (Browser left open)' });

  } catch (error: any) {
    console.error('[FB Login API] Error:', error);
    if (browser) {
      try { await browser.close(); } catch (e) { }
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
