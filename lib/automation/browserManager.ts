import { BrowserContext } from 'playwright';

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
  }
};
