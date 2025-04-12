import { SystemMonitor } from './lib/system-monitor';

const monitor = new SystemMonitor();
monitor.startMonitoring(metrics => {
    console.log('System Metrics:', metrics);
});

console.log('Running in CLI monitoring mode...');
