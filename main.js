const { app, BrowserWindow } = require('electron');
const path = require('path');

// Check for headless environment
const isHeadless = !process.env.DISPLAY || process.env.CODESPACES || process.env.CI;

if (isHeadless) {
    console.log('Detected headless environment, switching to CLI mode...');
    require('./cli.js');
    process.exit(0);
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);
