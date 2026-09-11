const fs = require('fs');
const path = '/Users/tiodev/Desktop/ManagerVideoUpload/electron-app/playwright-runner.js';
let content = fs.readFileSync(path, 'utf8');

// Add proxy-chain require
if (!content.includes('proxy-chain')) {
  content = content.replace(
    "const fs = require('fs');",
    "const fs = require('fs');\nconst { anonymizeProxy, closeAnonymizedProxy } = require('proxy-chain');"
  );
}

// Update proxy logic
if (!content.includes('anonymizeProxy(proxyUrl)')) {
  content = content.replace(
    `      if (proxy) {
        const proxyConfig = parseProxy(proxy);
        if (proxyConfig) {
          console.log('[Playwright] Using proxy:', proxyConfig.server);
          options.proxy = proxyConfig;
        } else {
          console.warn('[Playwright] Failed to parse proxy string:', proxy);
        }
      }`,
    `      let anonymizedProxyUrl;
      if (proxy) {
        const proxyConfig = parseProxy(proxy);
        if (proxyConfig) {
          console.log('[Playwright] Using proxy:', proxyConfig.server);
          if (proxyConfig.username && proxyConfig.password) {
            const proxyUrl = \`\${proxyConfig.server.startsWith('http') ? '' : 'http://'}\${encodeURIComponent(proxyConfig.username)}:\${encodeURIComponent(proxyConfig.password)}@\${proxyConfig.server.replace('http://', '').replace('https://', '')}\`;
            anonymizedProxyUrl = await anonymizeProxy(proxyUrl);
            console.log('[Playwright] Anonymized proxy:', anonymizedProxyUrl);
            options.proxy = { server: anonymizedProxyUrl };
          } else {
            options.proxy = { server: proxyConfig.server };
          }
        } else {
          console.warn('[Playwright] Failed to parse proxy string:', proxy);
        }
      }`
  );
}

// Store and handle closing proxy
if (!content.includes('_anonymizedProxyUrl = anonymizedProxyUrl')) {
  content = content.replace(
    `      browser = await chromium.launchPersistentContext(userDataDir, options);
      browser.proxyConfigStr = proxy || ''; // Save current proxy to detect changes later`,
    `      browser = await chromium.launchPersistentContext(userDataDir, options);
      if (anonymizedProxyUrl) {
        browser._anonymizedProxyUrl = anonymizedProxyUrl;
      }
      browser.proxyConfigStr = proxy || ''; // Save current proxy to detect changes later`
  );
}

if (!content.includes('closeAnonymizedProxy(anonymizedProxy)')) {
  content = content.replace(
    `      browser.on('close', () => {
        activeBrowsers.delete(profileId);
      });`,
    `      browser.on('close', () => {
        activeBrowsers.delete(profileId);
        const anonymizedProxy = browser._anonymizedProxyUrl;
        if (anonymizedProxy) {
          closeAnonymizedProxy(anonymizedProxy, true).catch(console.error);
        }
      });`
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('playwright-runner.js patched successfully.');
