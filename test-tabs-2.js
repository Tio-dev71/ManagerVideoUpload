const { chromium } = require('playwright');
const path = require('path');
const os = require('os');

(async () => {
  const userDataDir = path.join(os.homedir(), '.autopost', 'profiles', 'profile_61567148361147');
  
  console.log('Launching browser...');
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: ['--start-maximized'],
  });

  console.log('Waiting 3 seconds for restore...');
  await new Promise(r => setTimeout(r, 3000));

  const pages = browser.pages();
  console.log(`Pages found: ${pages.length}`);
  for (let i = 0; i < pages.length; i++) {
    console.log(`Page ${i} URL: ${pages[i].url()}`);
  }

  // Create a new tab and navigate to google
  const newPage = await browser.newPage();
  await newPage.goto('https://google.com');

  console.log('Leaving browser open. Exiting script in 5s.');
  await new Promise(r => setTimeout(r, 5000));
  // DO NOT browser.close() so the session is saved with google open!
  process.exit(0);
})();
