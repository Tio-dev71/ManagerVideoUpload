const { activeBrowsers } = require('./playwright-runner');
console.log('activeBrowsers keys:', Array.from(activeBrowsers.keys()));
