import { app, BrowserWindow } from 'electron';

console.log('Starting simple Electron test...');

app.whenReady().then(() => {
  console.log('App ready, creating window...');
  
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  console.log('Window created, loading content...');
  
  // Load a simple HTML page
  win.loadURL('data:text/html,<h1>Hello from Electron!</h1><p>This is a test window.</p>');
  
  win.on('closed', () => {
    console.log('Window closed');
  });
  
  console.log('Test window should be visible now');
});

app.on('window-all-closed', () => {
  console.log('All windows closed, quitting...');
  app.quit();
});

console.log('Electron test script loaded');
