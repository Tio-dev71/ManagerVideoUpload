const fs = require('fs');
const files = [
  '/Users/tiodev/Desktop/ManagerVideoUpload/lib/automation/browserManager.ts',
  '/Users/tiodev/Desktop/ManagerVideoUpload/electron-app/playwright-runner.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /const proxyUrl = \`\$\{proxyConfig\.server\.startsWith\('http'\) \? '' : 'http:\/\/'\}\$\{encodeURIComponent\(proxyConfig\.username\)\}:\$\{encodeURIComponent\(proxyConfig\.password\)\}@\$\{proxyConfig\.server\.replace\('http:\/\/', ''\)\.replace\('https:\/\/', ''\)\}\`;/g,
    "const proxyUrl = `http://${encodeURIComponent(proxyConfig.username)}:${encodeURIComponent(proxyConfig.password)}@${proxyConfig.server.replace('http://', '').replace('https://', '')}`;"
  );
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Fixed proxyUrl parsing in both files.');
