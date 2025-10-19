const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');

let server;

// Secure credential storage (in production, use electron-store or keytar)
const credentials = {
  LIVEKIT_URL: 'wss://arun-r1rz788x.livekit.cloud',
  LIVEKIT_API_KEY: 'APItH3u2ssWW5kt',
  LIVEKIT_API_SECRET: 'Dhbf3mJWrwWpr8gW0eO4LfaGCWnqfcMNPjfa51X06i0C'
};

// IPC handler for getting credentials
ipcMain.handle('get-credentials', async () => {
  return credentials;
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    }
  });

  // Handle media permissions
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true);
    } else {
      callback(false);
    }
  });

  const isDev = false; // Force production mode to use static files
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Start Express server to serve static files
    const expressApp = express();
    const outPath = path.join(__dirname, 'out');
    
    expressApp.use(express.static(outPath));
    
    server = expressApp.listen(0, () => {
      const port = server.address().port;
      mainWindow.loadURL(`http://localhost:${port}`);
      mainWindow.webContents.openDevTools();
    });
  }
}

app.whenReady().then(() => {
  // Request media access permissions on macOS
  if (process.platform === 'darwin') {
    const { systemPreferences } = require('electron');
    systemPreferences.askForMediaAccess('microphone');
    systemPreferences.askForMediaAccess('camera');
  }
  
  createWindow();
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
