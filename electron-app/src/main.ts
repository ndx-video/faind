import { app, BrowserWindow, Menu, shell, dialog, ipcMain } from 'electron';
import { join, resolve } from 'path';
import { spawn, ChildProcess } from 'child_process';
import { existsSync } from 'fs';
import { autoUpdater } from 'electron-updater';

// Type definitions
interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized?: boolean;
}

class ElectronApp {
  private mainWindow: BrowserWindow | null = null;
  private nextProcess: ChildProcess | null = null;
  private readonly isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  constructor() {
    // Debug logging for path resolution
    console.log('=== fAInd Electron Debug Info ===');
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    console.log('app.getAppPath():', app.getAppPath());
    console.log('isDev:', this.isDev);
    console.log('================================');

    this.init();
  }

  private async init(): Promise<void> {
    // Enable live reload for Electron in development
    if (this.isDev) {
      try {
        // Use require instead of dynamic import for better compatibility
        const electronReload = require('electron-reload');
        electronReload(__dirname, {
          electron: join(__dirname, '..', 'node_modules', '.bin', 'electron'),
          hardResetMethod: 'exit'
        });
      } catch (error) {
        console.log('electron-reload not available:', error);
      }
    }

    this.setupAppEvents();
    this.setupIpcHandlers();
  }

  private setupAppEvents(): void {
    app.whenReady().then(() => this.createWindow());

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        this.cleanup();
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });

    // Security: Prevent new window creation
    app.on('web-contents-created', (_, contents) => {
      contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
      });
    });
  }

  private setupIpcHandlers(): void {
    // App control handlers
    ipcMain.handle('app:minimize', () => {
      this.mainWindow?.minimize();
    });

    ipcMain.handle('app:maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });

    ipcMain.handle('app:close', () => {
      this.mainWindow?.close();
    });

    // File operation handlers
    ipcMain.handle('file:open', async () => {
      const result = await dialog.showOpenDialog(this.mainWindow!, {
        properties: ['openFile'],
        filters: [
          { name: 'All Files', extensions: ['*'] }
        ]
      });
      return result.filePaths[0];
    });

    ipcMain.handle('file:open-folder', async () => {
      const result = await dialog.showOpenDialog(this.mainWindow!, {
        properties: ['openDirectory']
      });
      return result.filePaths[0];
    });

    ipcMain.handle('file:show-in-folder', (_, path: string) => {
      shell.showItemInFolder(path);
    });

    // Search handlers (placeholder for future implementation)
    ipcMain.handle('search:files', async (_, query: string) => {
      // TODO: Implement actual file search logic
      console.log('Search query:', query);
      return [];
    });

    // Onlook integration handlers
    ipcMain.handle('onlook:read-file', async (_, path: string) => {
      // TODO: Implement secure file reading for Onlook
      console.log('Onlook read file:', path);
      return null;
    });

    ipcMain.handle('onlook:write-file', async (_, path: string, content: string) => {
      // TODO: Implement secure file writing for Onlook
      console.log('Onlook write file:', path, content.length);
      return true;
    });

    ipcMain.on('onlook:trigger-reload', () => {
      this.mainWindow?.webContents.reload();
    });
  }

  private createWindow(): void {
    const windowState: WindowState = this.getWindowState();

    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: windowState.width,
      height: windowState.height,
      x: windowState.x,
      y: windowState.y,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: resolve(__dirname, 'preload.js'),
        webSecurity: !this.isDev // Disable web security in development for localhost
      },
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      show: false, // Don't show until ready
      icon: this.getAppIcon()
    });

    // Restore window state
    if (windowState.isMaximized) {
      this.mainWindow.maximize();
    }

    // Set up the menu
    this.createMenu();

    // Load the app
    this.loadApp();

    // Show window when ready to prevent visual flash
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      
      if (this.isDev) {
        this.mainWindow?.focus();
      }
    });

    // Handle window events
    this.setupWindowEvents();
  }

  private getWindowState(): WindowState {
    // TODO: Implement window state persistence
    return {
      width: 1200,
      height: 800
    };
  }

  private getAppIcon(): string | undefined {
    const iconPath = resolve(__dirname, '..', 'assets', 'icon.png');
    return existsSync(iconPath) ? iconPath : undefined;
  }

  private loadApp(): void {
    if (this.isDev) {
      // In development, load from localhost:3000
      this.mainWindow?.loadURL('http://localhost:3000');
      
      // Open DevTools in development
      this.mainWindow?.webContents.openDevTools();
    } else {
      // In production, load the built Next.js app
      this.loadProductionApp();
    }
  }

  private loadProductionApp(): void {
    const nextAppPath = join(__dirname, '..', '..', 'project-1749984823338', '.next', 'standalone');
    
    if (existsSync(nextAppPath)) {
      // Start the Next.js standalone server
      this.startNextStandaloneServer();
      // Load from local server
      this.mainWindow?.loadURL('http://localhost:3000');
    } else {
      // Fallback: load static files directly
      const staticPath = join(__dirname, '..', '..', 'project-1749984823338', 'out', 'index.html');
      this.mainWindow?.loadFile(staticPath);
    }
  }

  private startNextStandaloneServer(): void {
    const serverPath = join(__dirname, '..', '..', 'project-1749984823338', '.next', 'standalone', 'server.js');
    
    if (existsSync(serverPath)) {
      this.nextProcess = spawn('node', [serverPath], {
        env: { ...process.env, PORT: '3000' },
        stdio: 'pipe'
      });

      this.nextProcess.stdout?.on('data', (data) => {
        console.log(`Next.js: ${data}`);
      });

      this.nextProcess.stderr?.on('data', (data) => {
        console.error(`Next.js Error: ${data}`);
      });

      this.nextProcess.on('close', (code) => {
        console.log(`Next.js process exited with code ${code}`);
      });
    }
  }

  private setupWindowEvents(): void {
    if (!this.mainWindow) return;

    this.mainWindow.on('closed', () => {
      this.cleanup();
      this.mainWindow = null;
    });

    // Handle external links
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    // Handle navigation to external URLs
    this.mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      
      if (parsedUrl.origin !== 'http://localhost:3000' && !this.isDev) {
        event.preventDefault();
        shell.openExternal(navigationUrl);
      }
    });
  }

  private createMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Search',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.mainWindow?.webContents.send('new-search');
            }
          },
          { type: 'separator' },
          {
            label: 'Preferences',
            accelerator: 'CmdOrCtrl+,',
            click: () => {
              this.mainWindow?.webContents.send('show-preferences');
            }
          },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'About fAInd',
            click: () => {
              dialog.showMessageBox(this.mainWindow!, {
                type: 'info',
                title: 'About fAInd',
                message: 'fAInd',
                detail: 'AI-powered file search application\nVersion 1.0.0\n\nBuilt with Electron and Next.js'
              });
            }
          }
        ]
      }
    ];

    // macOS specific menu adjustments
    if (process.platform === 'darwin') {
      template.unshift({
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });

      // Window menu
      const windowMenu = template.find(item => item.label === 'Window');
      if (windowMenu && Array.isArray(windowMenu.submenu)) {
        windowMenu.submenu = [
          { role: 'close' },
          { role: 'minimize' },
          { role: 'zoom' },
          { type: 'separator' },
          { role: 'front' }
        ];
      }
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private setupAutoUpdater(): void {
    if (!this.isDev) {
      autoUpdater.checkForUpdatesAndNotify();
      
      autoUpdater.on('update-available', () => {
        dialog.showMessageBox(this.mainWindow!, {
          type: 'info',
          title: 'Update Available',
          message: 'A new version is available. It will be downloaded in the background.',
          buttons: ['OK']
        });
      });
    }
  }

  private cleanup(): void {
    if (this.nextProcess) {
      this.nextProcess.kill();
      this.nextProcess = null;
    }
  }
}

// Initialize the app
new ElectronApp();
