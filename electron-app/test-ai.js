const { generateAIComment } = require('./automation-actions');

async function test() {
  const result = await generateAIComment('Hôm nay trời đẹp quá đi chơi thôi mọi người', {
    AI_MODEL: 'gemini-2.5-flash',
    GEMINI_API_KEY: 'abc' // Invalid key to see error
  });
  console.log('Result:', result);
}
test();
