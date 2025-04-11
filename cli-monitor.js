const si = require('systeminformation');
const process = require('process');
const asciichart = require('asciichart');

// Initialize data arrays for charts
const cpuHistory = new Array(50).fill(0);
const memHistory = new Array(50).fill(0);
const netHistory = new Array(50).fill(0);

function colorize(value) {
    const num = parseFloat(value);
    if (num > 90) return `\x1b[31m${value}\x1b[0m`; // red
    if (num > 70) return `\x1b[33m${value}\x1b[0m`; // yellow
    return `\x1b[32m${value}\x1b[0m`; // green
}

function createChart(data, label, width = 50, height = 10) {
    const config = {
        height: height,
        colors: [asciichart.blue],
        format: (x) => x.toFixed(1) + '%'
    };
    return label + '\n' + asciichart.plot(data, config);
}

async function displayMetrics() {
    try {
        const [cpu, mem, disk, net, temp, processes] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.cpuTemperature(),
            si.processes()
        ]);

        // Update history arrays
        cpuHistory.shift();
        cpuHistory.push(cpu.currentLoad);
        memHistory.shift();
        memHistory.push((mem.used/mem.total)*100);

        // Clear screen
        process.stdout.write('\x1Bc');
        
        console.log('\x1b[36m=== System Monitor (Enhanced CLI Mode) ===\x1b[0m');
        console.log('\x1b[90mPress Ctrl+C to exit\x1b[0m\n');

        // Display charts
        console.log(createChart(cpuHistory, 'CPU Usage'));
        console.log(createChart(memHistory, 'Memory Usage'));

        // System metrics
        console.log('\n\x1b[36mSystem Metrics:\x1b[0m');
        console.log(`CPU Load: ${colorize(cpu.currentLoad.toFixed(2))}%`);
        console.log(`Memory:   ${colorize(((mem.used/mem.total)*100).toFixed(2))}%`);
        console.log(`Disk:     ${colorize(disk[0].use.toFixed(2))}%`);
        if (temp.main) console.log(`CPU Temp: ${colorizeTemp(temp.main)}°C`);

        // Network stats
        const netSpeed = net[0] || { rx_sec: 0, tx_sec: 0 };
        console.log('\n\x1b[36mNetwork:\x1b[0m');
        console.log(`↑ Upload:   ${formatBytes(netSpeed.tx_sec)}/s`);
        console.log(`↓ Download: ${formatBytes(netSpeed.rx_sec)}/s`);

        // Top processes
        console.log('\n\x1b[36mTop Processes:\x1b[0m');
        processes.list
            .sort((a, b) => b.cpu - a.cpu)
            .slice(0, 5)
            .forEach(p => {
                console.log(`${p.name.padEnd(20)} CPU: ${p.cpu.toFixed(1)}% MEM: ${p.mem.toFixed(1)}%`);
            });

    } catch (error) {
        console.error('\x1b[31mError:', error.message, '\x1b[0m');
    }
}

function formatBytes(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

function colorizeTemp(temp) {
    if (temp > 80) return `\x1b[31m${temp}\x1b[0m`; // red
    if (temp > 60) return `\x1b[33m${temp}\x1b[0m`; // yellow
    return `\x1b[32m${temp}\x1b[0m`; // green
}

// Handle graceful exit
process.on('SIGINT', () => {
    console.log('\n\x1b[33mShutting down monitor...\x1b[0m');
    process.exit(0);
});

// Start monitoring
console.log('\x1b[33mStarting system monitor...\x1b[0m');
displayMetrics();
setInterval(displayMetrics, 2000);
