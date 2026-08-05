const { chromium } = require('playwright');
const path = require('path');
const os = require('os');

(async () => {
  const userDataDir = path.join(os.homedir(), '.autopost', 'profiles', 'profile_61567148361147');
  console.log('Launching context...');
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      '--disable-notifications',
      '--start-maximized',
      '--disable-save-password-bubble',
      '--disable-features=PasswordManager,CredentialManagementAPI'
    ],
    viewport: null,
  });

  const pages = browser.pages();
  console.log('Pages found:', pages.length);
  for (let i = 0; i < pages.length; i++) {
    console.log(`Page ${i}: ${pages[i].url()}`);
  }

  let page = pages.find(p => p.url().includes('facebook.com'));
  if (!page) {
    page = pages.find(p => p.url() !== 'about:blank') || pages[pages.length - 1];
  }

  console.log('Selected page URL:', page.url());

  console.log('Closing other about:blank tabs...');
  for (const p of pages) {
    if (p !== page && p.url() === 'about:blank') {
      console.log('Closing an about:blank tab');
      await p.close().catch(e => console.error(e));
    }
  }

  console.log('Bringing to front...');
  await page.bringToFront();

  console.log('Navigating...');
  await page.goto('https://www.facebook.com/', { waitUntil: 'domcontentloaded', timeout: 5000 });
  console.log('Navigated!');

  // Leave it open
})();
