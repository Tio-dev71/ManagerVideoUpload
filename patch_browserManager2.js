const fs = require('fs');
const path = '/Users/tiodev/Desktop/ManagerVideoUpload/lib/automation/browserManager.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `    browser = await chromium.launchPersistentContext(userDataDir, options);
    
    // Inject hardware fingerprint
    await browser.addInitScript(fingerprint.initScript);

    // Auto manage state
    browser.on('close', () => {
      global.activeBrowsers.delete(profileId);
    });`,
  `    browser = await chromium.launchPersistentContext(userDataDir, options);
    
    if (anonymizedProxyUrl) {
      (browser as any)._anonymizedProxyUrl = anonymizedProxyUrl;
    }

    // Inject hardware fingerprint
    await browser.addInitScript(fingerprint.initScript);

    // Auto manage state
    browser.on('close', () => {
      global.activeBrowsers.delete(profileId);
      if (anonymizedProxyUrl) {
        closeAnonymizedProxy(anonymizedProxyUrl, true).catch(console.error);
      }
    });`
);

fs.writeFileSync(path, content, 'utf8');
console.log('browserManager.ts patched successfully part 2.');
