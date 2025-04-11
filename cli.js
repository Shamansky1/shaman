const si = require('systeminformation');

if (require.main === module) {
    console.log('Starting system monitor in CLI mode...');
    console.log('Press Ctrl+C to exit\n');
    startMonitoring();
}

async function startMonitoring() {
    try {
        const [cpu, mem, disk, os] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.osInfo()
        ]);
        
        console.log('\n=== System Monitor ===');
        console.log(`OS: ${os.distro} ${os.release}`);
        console.log(`Time: ${new Date().toLocaleTimeString()}`);
        console.log('-'.repeat(30));

        console.log(`CPU Load: ${cpu.currentLoad.toFixed(2)}%`);
        console.log(`Memory: ${((mem.used/mem.total)*100).toFixed(2)}%`);
        console.log(`Disk: ${disk[0].use.toFixed(2)}%`);

    } catch (error) {
        console.error('Error:', error.message);
    }

    setTimeout(startMonitoring, 2000);
}

module.exports = { startMonitoring };
