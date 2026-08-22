import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export function getOrGenerateFingerprint(profileId: string) {
  const userDataDir = path.join(os.homedir(), '.autopost', 'profiles', profileId);
  const fingerprintPath = path.join(userDataDir, 'fingerprint.json');

  if (fs.existsSync(fingerprintPath)) {
    try {
      const data = fs.readFileSync(fingerprintPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error(`[Fingerprint] Failed to read existing fingerprint for ${profileId}`, err);
    }
  }

  // Generate new one if not exists or failed to read
  const fingerprint = getRandomFingerprint();
  
  try {
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }
    fs.writeFileSync(fingerprintPath, JSON.stringify(fingerprint, null, 2), 'utf8');
    console.log(`[Fingerprint] Generated and saved new fingerprint for ${profileId}`);
  } catch (err) {
    console.error(`[Fingerprint] Failed to save fingerprint for ${profileId}`, err);
  }

  return fingerprint;
}

export function getRandomFingerprint() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
  ];
  
  const locales = ['vi-VN', 'en-US', 'en-GB'];
  const timezones = ['Asia/Ho_Chi_Minh', 'America/New_York', 'Europe/London'];
  
  // Choose random properties
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  const locale = locales[Math.floor(Math.random() * locales.length)];
  const timezoneId = timezones[Math.floor(Math.random() * timezones.length)];
  
  // Random hardware specs
  const hardwareConcurrency = [4, 6, 8, 12, 16][Math.floor(Math.random() * 5)];
  const deviceMemory = [4, 8, 16][Math.floor(Math.random() * 3)];
  
  const initScript = `
    // Override hardware concurrency
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      get: () => ${hardwareConcurrency}
    });
    
    // Override device memory
    Object.defineProperty(navigator, 'deviceMemory', {
      get: () => ${deviceMemory}
    });

    // Mask webdriver
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });
  `;

  return {
    userAgent,
    locale,
    timezoneId,
    initScript
  };
}

export function parseProxy(proxyStr?: string | null) {
  if (!proxyStr) return undefined;
  
  // Strip whitespace
  proxyStr = proxyStr.trim();
  
  // Format: ip:port:user:pass
  const parts = proxyStr.split(':');
  if (parts.length === 4) {
    return {
      server: `http://${parts[0]}:${parts[1]}`,
      username: parts[2],
      password: parts[3]
    };
  }
  
  // Format: http://user:pass@ip:port or http://ip:port
  if (proxyStr.startsWith('http://') || proxyStr.startsWith('https://') || proxyStr.startsWith('socks5://')) {
    try {
      const url = new URL(proxyStr);
      const result: any = { server: `${url.protocol}//${url.hostname}:${url.port}` };
      if (url.username) result.username = decodeURIComponent(url.username);
      if (url.password) result.password = decodeURIComponent(url.password);
      return result;
    } catch (e) {
      console.error('[Fingerprint] Invalid proxy URL format:', proxyStr);
      return undefined;
    }
  }
  
  // Format: ip:port
  if (parts.length === 2) {
    return { server: `http://${parts[0]}:${parts[1]}` };
  }
  
  return { server: proxyStr };
}
