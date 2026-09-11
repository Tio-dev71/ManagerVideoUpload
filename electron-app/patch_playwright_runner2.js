const fs = require('fs');
const path = '/Users/tiodev/Desktop/ManagerVideoUpload/electron-app/playwright-runner.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "browser.on('close', () => activeBrowsers.delete(profileId));",
  `browser.on('close', () => {
        activeBrowsers.delete(profileId);
        const anonymizedProxy = browser._anonymizedProxyUrl;
        if (anonymizedProxy) {
          closeAnonymizedProxy(anonymizedProxy, true).catch(console.error);
        }
      });`
);

fs.writeFileSync(path, content, 'utf8');
console.log('playwright-runner.js patched successfully part 2.');
