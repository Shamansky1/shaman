const si = require('systeminformation');

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

async function updateMetrics() {
    try {
        const [cpu, mem, disk] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize()
        ]);

        document.getElementById('cpu-usage').textContent = `${cpu.currentLoad.toFixed(2)}%`;
        document.getElementById('ram-usage').textContent = 
            `${((mem.used/mem.total)*100).toFixed(2)}%`;
        document.getElementById('disk-usage').textContent = 
            `${disk[0].use.toFixed(2)}%`;

        cpuChart.data.datasets[0].data.push(cpu.currentLoad);
        cpuChart.data.datasets[0].data.shift();
        cpuChart.update('none');
    } catch (error) {
        console.error('Error:', error);
    }
}

setInterval(updateMetrics, 1000);
