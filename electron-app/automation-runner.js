const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { activeBrowsers, parseProxy, generateFingerprint } = require('./playwright-runner');

const stopFlags = new Set(); // Keep track of stopped tasks

async function stopTask(taskId) {
  stopFlags.add(taskId);
}

async function logHistory(profileId, actionType, link, message) {
  try {
    await fetch('https://topify.vn/api/automation-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, actionType, link, message })
    });
  } catch(e) {}
}

const {
  taskFbFarmReels,
  taskFbAutoInteract,
  taskFbAddFriendsGroup,
  taskFbInviteToGroup,
  taskFbBuffPost
} = require('./automation-actions');

async function runAutomationStub(profileId, actionType, config) {
  let browser = activeBrowsers.get(profileId);
  let isNewBrowser = false;

  try {
    if (!browser) {
      const userDataDir = path.join(os.homedir(), '.autopost', 'profiles', profileId);
      const lockFile = path.join(userDataDir, 'SingletonLock');
      
      if (fs.existsSync(lockFile)) {
         console.warn(`[Automation] Profile ${profileId} is locked but not in activeBrowsers. This might cause EPERM.`);
      }

      const options = {
        headless: false,
        args: [
          '--disable-notifications',
          '--disable-save-password-bubble',
          '--disable-features=PasswordManager,CredentialManagementAPI',
          '--start-maximized'
        ],
        viewport: null,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        locale: 'vi-VN',
        timezoneId: 'Asia/Ho_Chi_Minh',
      };

      try {
        options.channel = 'chrome'; // Thử dùng Google Chrome trước
        browser = await chromium.launchPersistentContext(userDataDir, options);
      } catch (e) {
        console.log('[Automation] Chrome không khả dụng, thử dùng Edge...');
        options.channel = 'msedge'; // Fallback sang Microsoft Edge
        browser = await chromium.launchPersistentContext(userDataDir, options);
      }
      
      browser.on('close', () => activeBrowsers.delete(profileId));
      activeBrowsers.set(profileId, browser);
      isNewBrowser = true;
    }

    console.log(`[Automation] Starting task ${actionType} for profile ${profileId}`);
    
    const pages = browser.pages();
    let page = pages.find(p => p.url().includes('facebook.com'));
    
    if (!page) {
      page = pages.length > 0 ? pages[0] : await browser.newPage();
    }
    await page.bringToFront();
    
    if (page.url() === 'about:blank' || !page.url().includes('facebook.com')) {
      await page.goto('https://www.facebook.com/', { waitUntil: 'domcontentloaded' });
    }
    
    switch (actionType) {
      case 'fb_farm_reels':
        await taskFbFarmReels(page, config, profileId);
        break;
      case 'fb_buff_post':
        await taskFbBuffPost(page, config, profileId);
        break;
      case 'fb_auto_interact':
        await taskFbAutoInteract(page, config, profileId);
        break;
      case 'fb_add_friends_group':
        await taskFbAddFriendsGroup(page, config, profileId);
        break;
      case 'fb_invite_to_group':
        await taskFbInviteToGroup(page, config, profileId);
        break;
      default:
        console.warn(`[Automation] Unknown task type: ${actionType}`);
        await page.waitForTimeout(2000);
    }
    
    console.log(`[Automation] Finished action for ${profileId}`);
    return { success: true, profileId, message: 'Hoạt động thành công' };
  } catch (error) {
    console.error(`[Automation] Error for profile ${profileId}:`, error);
    await logHistory(profileId, actionType, '', `Lỗi: ${error.message}`);
    return { success: false, profileId, error: error.message };
  } finally {
    // Không đóng trình duyệt tự động để giữ cho Live Dashboard tiếp tục hiển thị
    console.log(`[Automation] Xong task cho ${profileId}, giữ trình duyệt mở...`);
  }
}

async function startAutomationTask(taskData) {
  const { taskId, actionType, profileIds, config } = taskData;
  console.log(`[Automation] Starting Task ${taskId} with ${profileIds.length} profiles`);
  
  stopFlags.delete(taskId);
  const results = [];
  
  // Run sequentially to save resources, can be made parallel later
  for (const profileId of profileIds) {
    if (stopFlags.has(taskId)) {
      console.log(`[Automation] Task ${taskId} was stopped. Bỏ qua profile ${profileId}`);
      results.push({ success: false, profileId, error: 'Task stopped by user' });
      continue;
    }

    config.checkStop = () => stopFlags.has(taskId);
    const result = await runAutomationStub(profileId, actionType, config);
    results.push(result);
  }
  
  stopFlags.delete(taskId);
  return { success: true, results };
}

module.exports = { startAutomationTask, stopTask };
