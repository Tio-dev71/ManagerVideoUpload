const fs = require('fs');
let content = fs.readFileSync('lib/automation/engine.ts', 'utf-8');

content = content.replace(/await page\.waitForTimeout\((.+?)\);/g, (match, p1) => {
  if (p1.includes('Math.min')) return match; // don't replace inside safeWait itself
  return `await this.safeWait(page, ${p1}, profileId);`;
});

fs.writeFileSync('lib/automation/engine.ts', content, 'utf-8');
console.log('Patched the rest of waitForTimeouts');
