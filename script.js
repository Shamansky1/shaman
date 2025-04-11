const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function formatBytes(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
}

// Initialize Charts
const cpuChart = new Chart(document.getElementById('cpuChart'), {
    type: 'line',
    data: {
        labels: Array(30).fill(''),
        datasets: [{
            label: 'CPU Usage',
            data: Array(30).fill(0),
            borderColor: '#4CAF50',
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: { y: { min: 0, max: 100 } }
    }
});

// Similar chart configurations for memory and network...

async function measureLatency() {
    const startTime = performance.now();
    try {
        await si.time();
        const systemLatency = performance.now() - startTime;
        document.getElementById('system-latency').textContent = `${systemLatency.toFixed(2)}ms`;
    } catch (error) {
        console.error('Error measuring latency:', error);
    }
}

async function measureDPCLatency() {
    if (process.platform === 'win32') {
        try {
            const { exec } = require('child_process');
            exec('powershell "Get-WinEvent -FilterHashtable @{LogName=\'System\';ID=100} -MaxEvents 1 | Select-Object -ExpandProperty Properties | Select-Object -ExpandProperty Value"', 
                (error, stdout) => {
                    if (!error) {
                        document.getElementById('dpc-latency').textContent = `${parseFloat(stdout).toFixed(2)}ms`;
                    }
                });
        } catch (error) {
            console.error('Error measuring DPC latency:', error);
        }
    }
}

async function updatePerformanceCounters() {
    try {
        const [cpu, mem, disk, temp, net, diskIO] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.cpuTemperature(),
            si.networkStats(),
            si.disksIO()
        ]);

        // Update existing monitors...

        // Update charts
        updateChart(cpuChart, cpu.currentLoad);
        // Update other charts...

        // Update disk I/O
        document.getElementById('disk-read').textContent = formatBytes(diskIO.rIO_sec) + '/s';
        document.getElementById('disk-write').textContent = formatBytes(diskIO.wIO_sec) + '/s';

        // Measure latencies
        measureLatency();
        measureDPCLatency();

    } catch (error) {
        console.error('Error updating performance counters:', error);
    }
}

function updateChart(chart, value) {
    chart.data.datasets[0].data.push(value);
    chart.data.datasets[0].data.shift();
    chart.update('none');
}

async function updateAdvancedMetrics() {
    try {
        const [gpu, power, drivers] = await Promise.all([
            si.graphics(),
            si.powerShell('Get-Counter "\\Processor Information(_Total)\\% Processor Performance"'),
            si.observe('driverLatency')
        ]);

        // Update GPU metrics
        if (gpu.controllers[0]) {
            document.getElementById('gpu-usage').textContent = `${gpu.controllers[0].utilizationGpu || 0}%`;
            document.getElementById('vram-usage').textContent = `${gpu.controllers[0].memoryUsed || 0}MB`;
            document.getElementById('gpu-temp').textContent = `${gpu.controllers[0].temperatureGpu || 0}°C`;
        }

        // Update power metrics
        updateChart(powerChart, power);

        // Update driver latency heatmap
        updateHeatmap('driver-heatmap', drivers);

        // Memory breakdown
        const memBreakdown = await si.processes();
        updateMemoryBreakdown(memBreakdown);

        // Network quality
        const netQuality = await checkNetworkQuality();
        updateNetworkQuality(netQuality);

    } catch (error) {
        console.error('Error updating advanced metrics:', error);
    }
}

function checkNetworkQuality() {
    return new Promise(async (resolve) => {
        const start = performance.now();
        try {
            await fetch('https://www.google.com/generate_204');
            const latency = performance.now() - start;
            resolve({
                latency,
                quality: latency < 50 ? 'Excellent' : latency < 100 ? 'Good' : 'Poor'
            });
        } catch (error) {
            resolve({ latency: 0, quality: 'Disconnected' });
        }
    });
}

// Initialize new charts
const powerChart = new Chart(document.getElementById('powerChart'), {
    type: 'line',
    data: {
        labels: Array(30).fill(''),
        datasets: [{
            label: 'Power Consumption (W)',
            data: Array(30).fill(0),
            borderColor: '#ff7f50',
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: { y: { beginAtZero: true } }
    }
});

// Update interval
setInterval(updateAdvancedMetrics, 1000);
