const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log('=== fAInder Electron App Starting ===');
console.log('Current working directory:', process.cwd());
console.log('App path:', app.getAppPath());
console.log('__dirname:', __dirname);

let mainWindow;

function createWindow() {
  console.log('Creating main window...');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Check if React dev server is running
  const isDev = process.env.NODE_ENV === 'development';
  console.log('Development mode:', isDev);
  
  if (isDev) {
    console.log('Loading React dev server...');
    mainWindow.loadURL('http://localhost:5173')
      .then(() => {
        console.log('React app loaded successfully');
        mainWindow.webContents.openDevTools();
      })
      .catch(err => {
        console.error('Failed to load React app:', err);
        // Fallback to error page
        mainWindow.loadURL('data:text/html,<h1>fAInder Desktop</h1><p>React dev server not running on localhost:5173</p><p>Please start the React app first.</p>');
      });
  } else {
    console.log('Loading production build...');
    // For now, just show a placeholder
    mainWindow.loadURL('data:text/html,<h1>fAInder Desktop</h1><p>Production mode - React app integration coming soon</p>');
  }

  mainWindow.on('closed', () => {
    console.log('Window closed');
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log('App ready, creating window...');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

console.log('Electron main script loaded successfully');
