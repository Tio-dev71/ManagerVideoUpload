import { startWorker } from './lib/queue/worker';

console.log('═══════════════════════════════════════');
console.log('  AutoReel Lite — Queue Worker');
console.log('═══════════════════════════════════════');

startWorker();

// Keep process alive
process.on('SIGTERM', () => {
  console.log('Worker shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Worker shutting down...');
  process.exit(0);
});
