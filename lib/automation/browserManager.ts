import { BrowserContext, chromium } from 'playwright';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { getRandomFingerprint, parseProxy } from './fingerprint';

declare global {
  var activeBrowsers: Map<string, BrowserContext>;
  var stopFlags: Map<string, boolean>;
}

if (!global.activeBrowsers) {
  global.activeBrowsers = new Map<string, BrowserContext>();
}
if (!global.stopFlags) {
  global.stopFlags = new Map<string, boolean>();
}

export const browserManager = {
  getBrowser: (profileId: string) => {
    return global.activeBrowsers.get(profileId);
  },
  setBrowser: (profileId: string, browser: BrowserContext) => {
    global.activeBrowsers.set(profileId, browser);
    
    // Auto-remove when disconnected
    browser.on('disconnected', () => {
      global.activeBrowsers.delete(profileId);
    });
  },
  removeBrowser: (profileId: string) => {
    global.activeBrowsers.delete(profileId);
  },
  stopTask: (profileId: string) => {
    global.stopFlags.set(profileId, true);
  },
  clearStopFlag: (profileId: string) => {
    global.stopFlags.delete(profileId);
  },
  isStopped: (profileId: string) => {
    return global.stopFlags.get(profileId) === true;
  },
  
  /**
   * Centralized method to launch a browser with Proxy and Fingerprint
   */
  launchBrowser: async (profileId: string, proxyStr?: string | null) => {
    let browser = global.activeBrowsers.get(profileId);
    if (browser) {
      console.log(`[BrowserManager] Browser already running for ${profileId}. Reusing it.`);
      return browser;
    }

    const userDataDir = path.join(os.homedir(), '.autopost', 'profiles', profileId);
    
    // Check if locked
    const lockFile = path.join(userDataDir, 'SingletonLock');
    if (fs.existsSync(lockFile)) {
      console.error(`[BrowserManager] Lock file exists for ${profileId}.`);
      throw new Error('Trình duyệt của tài khoản này đang được mở ở một tiến trình khác. Hãy tắt nó trước!');
    }

    const options: any = {
      headless: false,
      args: [
        '--disable-notifications',
        '--start-maximized',
        '--disable-save-password-bubble',
        '--disable-features=PasswordManager,CredentialManagementAPI'
      ],
      viewport: null,
    };

    // Apply Proxy
    if (proxyStr) {
      const proxyConfig = parseProxy(proxyStr);
      if (proxyConfig) {
        console.log(`[BrowserManager] Applying proxy for ${profileId}: ${proxyConfig.server}`);
        options.proxy = proxyConfig;
      }
    }

    // Apply Random Fingerprint
    const fingerprint = getRandomFingerprint();
    options.userAgent = fingerprint.userAgent;
    options.locale = fingerprint.locale;
    options.timezoneId = fingerprint.timezoneId;
    
    console.log(`[BrowserManager] Launching ${profileId} with UA: ${fingerprint.userAgent.substring(0, 30)}...`);

    browser = await chromium.launchPersistentContext(userDataDir, options);
    
    // Inject hardware fingerprint
    await browser.addInitScript(fingerprint.initScript);

    // Auto manage state
    browser.on('close', () => {
      global.activeBrowsers.delete(profileId);
    });
    global.activeBrowsers.set(profileId, browser);

    return browser;
  }
};
