const { app, BrowserWindow } = require('electron');

const isHeadless = !process.env.DISPLAY || process.env.CODESPACES;

if (isHeadless) {
    console.log('Detected headless environment, switching to CLI mode...');
    require('./cli-monitor.js');
    process.exit(0);
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
