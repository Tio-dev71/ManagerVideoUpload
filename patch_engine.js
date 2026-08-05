const fs = require('fs');

let content = fs.readFileSync('lib/automation/engine.ts', 'utf-8');

// 1. Add checkStop and safeWait methods
const methodsToAdd = `
  static checkStop(profileId: string) {
    if (browserManager.isStopped(profileId)) {
      throw new Error('Task stopped by user');
    }
  }

  static async safeWait(page: Page, ms: number, profileId: string) {
    const start = Date.now();
    while (Date.now() - start < ms) {
      this.checkStop(profileId);
      await page.waitForTimeout(Math.min(500, ms - (Date.now() - start)));
    }
  }
`;
content = content.replace('export class AutomationEngine {', 'export class AutomationEngine {' + methodsToAdd);

// 2. Pass profileId to methods
content = content.replace('static async humanScroll(page: Page, scrolls = 3)', 'static async humanScroll(page: Page, profileId: string, scrolls = 3)');
content = content.replace('static async randomInteract(page: Page, config: TaskConfig, chance = 0.3)', 'static async randomInteract(page: Page, config: TaskConfig, profileId: string, chance = 0.3)');

content = content.replace(/static async taskFb([A-Za-z]+)\(page: Page, config: TaskConfig\)/g, 'static async taskFb$1(page: Page, config: TaskConfig, profileId: string)');

// 3. Update method calls to pass profileId
content = content.replace(/await this\.humanScroll\(page, ([^)]+)\)/g, 'await this.humanScroll(page, profileId, $1)');
content = content.replace(/await this\.randomInteract\(page, config, ([^)]+)\)/g, 'await this.randomInteract(page, config, profileId, $1)');

content = content.replace(/await this\.taskFb([A-Za-z]+)\(page, config\)/g, 'await this.taskFb$1(page, config, profileId)');

// 4. Replace waitForTimeout with safeWait
// Note: we don't replace page.waitForTimeout inside safeWait itself because it uses page.waitForTimeout
content = content.replace(/await page\.waitForTimeout\(([^)]+)\);/g, (match, p1) => {
  return `await this.safeWait(page, ${p1}, profileId);`;
});

// Fix safeWait itself (we accidentally replaced it inside the string we just added!)
content = content.replace(/await this\.safeWait\(page, Math\.min\(500, ms - \(Date\.now\(\) - start\)\), profileId\);/g, 'await page.waitForTimeout(Math.min(500, ms - (Date.now() - start)));');

// We also need to add profileId check in the outer loop of runTask maybe? Or inside the task functions?
// The safeWait and humanScroll will catch it frequently enough!

fs.writeFileSync('lib/automation/engine.ts', content, 'utf-8');
console.log('Patched engine.ts successfully');
