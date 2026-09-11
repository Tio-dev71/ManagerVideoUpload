const fs = require('fs');
const path = '/Users/tiodev/Desktop/ManagerVideoUpload/lib/automation/browserManager.ts';
let content = fs.readFileSync(path, 'utf8');

// Add import
if (!content.includes('proxy-chain')) {
  content = content.replace(
    "import { getOrGenerateFingerprint, parseProxy } from './fingerprint';",
    "import { getOrGenerateFingerprint, parseProxy } from './fingerprint';\nimport { anonymizeProxy, closeAnonymizedProxy } from 'proxy-chain';"
  );
}

// Modify browser.on('close')
if (!content.includes('_anonymizedProxyUrl')) {
  content = content.replace(
    `    browser.on('close', () => {
      global.activeBrowsers.delete(profileId);
    });`,
    `    browser.on('close', () => {
      global.activeBrowsers.delete(profileId);
      const anonymizedProxy = (browser as any)._anonymizedProxyUrl;
      if (anonymizedProxy) {
        closeAnonymizedProxy(anonymizedProxy, true).catch(console.error);
      }
    });`
  );
}

// Modify options.proxy
if (!content.includes('anonymizeProxy(proxyUrl)')) {
  content = content.replace(
    `    // Apply Proxy
    if (proxyStr) {
      const proxyConfig = parseProxy(proxyStr);
      if (proxyConfig) {
        console.log(\`[BrowserManager] Applying proxy for \${profileId}: \${proxyConfig.server}\`);
        options.proxy = proxyConfig;
      }
    }`,
    `    // Apply Proxy
    let anonymizedProxyUrl: string | undefined;
    if (proxyStr) {
      const proxyConfig = parseProxy(proxyStr);
      if (proxyConfig) {
        console.log(\`[BrowserManager] Applying proxy for \${profileId}: \${proxyConfig.server}\`);
        if (proxyConfig.username && proxyConfig.password) {
          const proxyUrl = \`\${proxyConfig.server.startsWith('http') ? '' : 'http://'}\${encodeURIComponent(proxyConfig.username)}:\${encodeURIComponent(proxyConfig.password)}@\${proxyConfig.server.replace('http://', '').replace('https://', '')}\`;
          anonymizedProxyUrl = await anonymizeProxy(proxyUrl);
          console.log(\`[BrowserManager] Anonymized proxy: \${anonymizedProxyUrl}\`);
          options.proxy = { server: anonymizedProxyUrl };
        } else {
          options.proxy = { server: proxyConfig.server };
        }
      }
    }`
  );
}

// Store anonymized proxy on browser object
if (!content.includes('(browser as any)._anonymizedProxyUrl')) {
  content = content.replace(
    `    browser = await chromium.launchPersistentContext(userDataDir, options);
    
    // Inject hardware fingerprint`,
    `    browser = await chromium.launchPersistentContext(userDataDir, options);
    
    if (anonymizedProxyUrl) {
      (browser as any)._anonymizedProxyUrl = anonymizedProxyUrl;
    }

    // Inject hardware fingerprint`
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('browserManager.ts patched successfully.');
