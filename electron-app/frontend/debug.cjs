const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set localStorage so we bypass the login screen and hit the dashboard
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('topify_token', 'test-token');
    localStorage.setItem('topify_user', JSON.stringify({ id: 1, role: 'ADMIN', name: 'Test' }));
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE LOG (ERROR):', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  await browser.close();
})();
