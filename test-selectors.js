const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
const fs = require('fs');

(async () => {
  const profileId = 'profile_61567148361147';
  const userDataDir = path.join(os.homedir(), '.autopost', 'profiles', profileId);
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: null
  });

  const page = browser.pages()[0] || await browser.newPage();
  
  await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  // Just take a screenshot
  await page.screenshot({ path: 'test_feed.jpg' });
  
  // Get all texts of elements that might be buttons
  const buttonTexts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div[role="button"], a, span[dir="auto"]'))
      .map(el => el.innerText ? el.innerText.trim() : (el.getAttribute('aria-label') || ''))
      .filter(t => t.length > 0 && t.length < 50);
  });
  
  fs.writeFileSync('feed_texts.json', JSON.stringify(buttonTexts, null, 2));

  // Test Group
  await page.goto('https://www.facebook.com/groups/2405021203028247/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'test_group.jpg' });
  
  const groupTexts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div[role="button"], a, span[dir="auto"]'))
      .map(el => el.innerText ? el.innerText.trim() : (el.getAttribute('aria-label') || ''))
      .filter(t => t.length > 0 && t.length < 50);
  });
  
  fs.writeFileSync('group_texts.json', JSON.stringify(groupTexts, null, 2));

  await browser.close();
})();
