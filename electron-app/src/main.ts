const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const { join, resolve, dirname } = require('path');
const { readdir, stat, access } = require('fs/promises');
const { constants, existsSync } = require('fs');

// IPC channel names (inlined to avoid module dependency issues)
const IPC_CHANNELS = {
  // File operations
  READ_DIRECTORY: 'read-directory',
  SEARCH_FILES: 'search-files',
  OPEN_FILE: 'open-file',
  SHOW_IN_FOLDER: 'show-in-folder',
  SELECT_DIRECTORY: 'select-directory',

  // Search engine
  INDEX_DIRECTORY: 'index-directory',
  GET_SEARCH_INDEX: 'get-search-index',
  CLEAR_INDEX: 'clear-index',

  // Application
  GET_APP_VERSION: 'get-app-version',
  GET_APP_PATH: 'get-app-path',
  QUIT: 'quit',
  MINIMIZE: 'minimize',
  MAXIMIZE: 'maximize',
  UNMAXIMIZE: 'unmaximize',
  CLOSE: 'close',

  // Preferences
  GET_PREFERENCES: 'get-preferences',
  SET_PREFERENCES: 'set-preferences',

  // Window state
  GET_WINDOW_STATE: 'get-window-state',
  SET_WINDOW_STATE: 'set-window-state',

  // Events
  SEARCH_PROGRESS: 'search-progress',
  INDEX_UPDATE: 'index-update',
  FILE_CHANGE: 'file-change',

  // Onlook
  ONLOOK_READ_FILE: 'onlook-read-file',
  ONLOOK_WRITE_FILE: 'onlook-write-file',
  ONLOOK_RELOAD: 'onlook-reload'
};

// CommonJS __dirname is available by default
// const __dirname is already available in CommonJS

// Debug logging function
const debugLog = (message: string, data?: any) => {
  console.log(`[fAInder Debug] ${message}`, data || '');
};

class FAInderApp {
  private mainWindow: BrowserWindow | null = null;
  private isDevelopment = process.env.NODE_ENV === 'development';
  private reactAppPath: string;
  private appRoot: string;

  // Application state
  private preferences: AppPreferences = {
    theme: 'system',
    searchPaths: [],
    excludePatterns: ['node_modules', '.git', '.DS_Store'],
    maxFileSize: 100 * 1024 * 1024, // 100MB
    enableFileWatcher: true,
    searchTimeout: 30000,
    maxResults: 1000,
    showHiddenFiles: false,
    autoIndex: true
  };

  private windowState: WindowState = {
    width: 1200,
    height: 800,
    isMaximized: false,
    isFullScreen: false
  };

  constructor() {
    // Determine application root directory
    this.appRoot = app.getAppPath();
    debugLog('App root path', this.appRoot);
    debugLog('__dirname', __dirname);
    debugLog('Development mode', this.isDevelopment);

    // Determine React app path with proper error handling
    this.reactAppPath = this.determineReactAppPath();
    debugLog('React app path', this.reactAppPath);

    this.initializeApp();
  }

  private determineReactAppPath(): string {
    if (this.isDevelopment) {
      // Development: Use Vite dev server
      return 'http://localhost:5174';
    } else {
      // Production: Look for built React app
      // Based on our path testing, the correct paths are:
      const possiblePaths = [
        join(this.appRoot, '..', 'polymet-fainder', 'index.html'),
        join(__dirname, '..', 'polymet-fainder', 'index.html'),
        join(process.resourcesPath, 'app', 'index.html'),
        join(this.appRoot, 'polymet-fainder', 'dist', 'index.html')
      ];

      for (const testPath of possiblePaths) {
        debugLog('Checking React app path', testPath);
        try {
          if (existsSync(testPath)) {
            debugLog('Found React app at', testPath);
            return testPath;
          }
        } catch (error) {
          debugLog('Path check failed', { path: testPath, error });
        }
      }

      // Fallback to first option
      debugLog('No React app found, using fallback', possiblePaths[0]);
      return possiblePaths[0];
    }
  }

  private initializeApp(): void {
    debugLog('Initializing fAInder app');

    // Handle app ready
    app.whenReady().then(() => {
      debugLog('App ready, creating window');
      this.createMainWindow();
      this.setupIPC();
      this.createMenu();

      app.on('activate', () => {
        debugLog('App activated');
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    }).catch(error => {
      console.error('Failed to initialize app:', error);
      debugLog('Initialization error', error);
    });

    // Handle all windows closed
    app.on('window-all-closed', () => {
      debugLog('All windows closed');
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Security: Prevent new window creation
    app.on('web-contents-created', (_, contents) => {
      contents.on('new-window', (event, navigationUrl) => {
        debugLog('Preventing new window', navigationUrl);
        event.preventDefault();
        shell.openExternal(navigationUrl);
      });
    });

    // Global error handling
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      debugLog('Uncaught exception', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      debugLog('Unhandled rejection', { reason, promise });
    });
  }

  private createMainWindow(): void {
    debugLog('Creating main window');

    // Resolve preload script path
    const preloadPath = join(__dirname, 'preload.js');
    debugLog('Preload script path', preloadPath);

    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: this.windowState.width,
      height: this.windowState.height,
      x: this.windowState.x,
      y: this.windowState.y,
      minWidth: 800,
      minHeight: 600,
      show: false,
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: !this.isDevelopment,
        preload: preloadPath
      }
    });

    // Add error handling for loading
    this.mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      debugLog('Failed to load', { errorCode, errorDescription, validatedURL });
      console.error('Failed to load React app:', errorDescription);
    });

    this.mainWindow.webContents.on('did-finish-load', () => {
      debugLog('React app loaded successfully');
    });

    // Load the React app with error handling
    this.loadReactApp();

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      debugLog('Window ready to show');
      this.mainWindow?.show();

      if (this.windowState.isMaximized) {
        this.mainWindow?.maximize();
      }
    });

    // Handle window events
    this.mainWindow.on('closed', () => {
      debugLog('Window closed');
      this.mainWindow = null;
    });

    this.mainWindow.on('resize', () => {
      this.saveWindowState();
    });

    this.mainWindow.on('move', () => {
      this.saveWindowState();
    });

    this.mainWindow.on('maximize', () => {
      this.windowState.isMaximized = true;
    });

    this.mainWindow.on('unmaximize', () => {
      this.windowState.isMaximized = false;
    });
  }

  private async loadReactApp(): Promise<void> {
    if (!this.mainWindow) return;

    try {
      if (this.isDevelopment) {
        debugLog('Loading development server', this.reactAppPath);
        await this.mainWindow.loadURL(this.reactAppPath);
        this.mainWindow.webContents.openDevTools();
      } else {
        debugLog('Loading production file', this.reactAppPath);
        await this.mainWindow.loadFile(this.reactAppPath);
      }
    } catch (error) {
      console.error('Failed to load React app:', error);
      debugLog('Load error', error);

      // Fallback: try to load a simple error page
      const errorHtml = `
        <html>
          <head><title>fAInder - Loading Error</title></head>
          <body>
            <h1>fAInder Desktop</h1>
            <p>Failed to load the application.</p>
            <p>Error: ${error}</p>
            <p>Path attempted: ${this.reactAppPath}</p>
            <p>Development mode: ${this.isDevelopment}</p>
          </body>
        </html>
      `;

      await this.mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
    }
  }

  private saveWindowState(): void {
    if (!this.mainWindow) return;
    
    const bounds = this.mainWindow.getBounds();
    this.windowState = {
      ...this.windowState,
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      isMaximized: this.mainWindow.isMaximized(),
      isFullScreen: this.mainWindow.isFullScreen()
    };
  }

  private createMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Open Folder...',
            accelerator: 'CmdOrCtrl+O',
            click: () => this.selectDirectory()
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => app.quit()
          }
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
          { role: 'selectall' }
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
      }
    ];

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
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private setupIPC(): void {
    // File operations
    ipcMain.handle(IPC_CHANNELS.READ_DIRECTORY, async (_, path: string): Promise<FileEntry[]> => {
      return this.readDirectory(path);
    });

    ipcMain.handle(IPC_CHANNELS.SEARCH_FILES, async (_, query: SearchQuery): Promise<SearchResult[]> => {
      return this.searchFiles(query);
    });

    ipcMain.handle(IPC_CHANNELS.OPEN_FILE, async (_, path: string): Promise<void> => {
      return shell.openPath(path);
    });

    ipcMain.handle(IPC_CHANNELS.SHOW_IN_FOLDER, async (_, path: string): Promise<void> => {
      return shell.showItemInFolder(path);
    });

    ipcMain.handle(IPC_CHANNELS.SELECT_DIRECTORY, async (): Promise<string | null> => {
      return this.selectDirectory();
    });

    // Application operations
    ipcMain.handle(IPC_CHANNELS.GET_APP_VERSION, async (): Promise<string> => {
      return app.getVersion();
    });

    ipcMain.handle(IPC_CHANNELS.GET_APP_PATH, async (): Promise<string> => {
      return app.getAppPath();
    });

    // Window operations
    ipcMain.handle(IPC_CHANNELS.MINIMIZE, async (): Promise<void> => {
      this.mainWindow?.minimize();
    });

    ipcMain.handle(IPC_CHANNELS.MAXIMIZE, async (): Promise<void> => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });

    ipcMain.handle(IPC_CHANNELS.CLOSE, async (): Promise<void> => {
      this.mainWindow?.close();
    });

    // Preferences
    ipcMain.handle(IPC_CHANNELS.GET_PREFERENCES, async (): Promise<AppPreferences> => {
      return this.preferences;
    });

    ipcMain.handle(IPC_CHANNELS.SET_PREFERENCES, async (_, prefs: Partial<AppPreferences>): Promise<void> => {
      this.preferences = { ...this.preferences, ...prefs };
    });

    // Window state
    ipcMain.handle(IPC_CHANNELS.GET_WINDOW_STATE, async (): Promise<WindowState> => {
      return this.windowState;
    });

    // Onlook integration
    ipcMain.handle(IPC_CHANNELS.ONLOOK_READ_FILE, async (_, path: string): Promise<string | null> => {
      try {
        const { readFile } = await import('fs/promises');
        const content = await readFile(path, 'utf-8');
        return content;
      } catch (error) {
        console.error('Failed to read file for Onlook:', error);
        return null;
      }
    });

    ipcMain.handle(IPC_CHANNELS.ONLOOK_WRITE_FILE, async (_, path: string, content: string): Promise<boolean> => {
      try {
        const { writeFile } = await import('fs/promises');
        await writeFile(path, content, 'utf-8');
        return true;
      } catch (error) {
        console.error('Failed to write file for Onlook:', error);
        return false;
      }
    });

    // Placeholder handlers for search engine operations (Phase 3)
    ipcMain.handle(IPC_CHANNELS.INDEX_DIRECTORY, async (_, path: string): Promise<void> => {
      console.log('Index directory requested:', path);
      // TODO: Implement in Phase 3
    });

    ipcMain.handle(IPC_CHANNELS.GET_SEARCH_INDEX, async (): Promise<IndexStats> => {
      // TODO: Implement in Phase 3
      return {
        totalFiles: 0,
        totalDirectories: 0,
        indexedFiles: 0,
        lastUpdated: new Date(),
        indexSize: 0,
        isIndexing: false
      };
    });

    ipcMain.handle(IPC_CHANNELS.CLEAR_INDEX, async (): Promise<void> => {
      console.log('Clear index requested');
      // TODO: Implement in Phase 3
    });
  }

  private async readDirectory(dirPath: string): Promise<FileEntry[]> {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });
      const fileEntries: FileEntry[] = [];

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);

        try {
          const stats = await stat(fullPath);
          const extension = entry.isFile() ?
            entry.name.split('.').pop()?.toLowerCase() || '' : '';

          // Check permissions
          let readable = false, writable = false, executable = false;
          try {
            await access(fullPath, constants.R_OK);
            readable = true;
          } catch {}

          try {
            await access(fullPath, constants.W_OK);
            writable = true;
          } catch {}

          try {
            await access(fullPath, constants.X_OK);
            executable = true;
          } catch {}

          fileEntries.push({
            name: entry.name,
            path: fullPath,
            absolutePath: resolve(fullPath),
            isDirectory: entry.isDirectory(),
            size: stats.size,
            modified: stats.mtime,
            created: stats.birthtime,
            extension,
            permissions: { readable, writable, executable }
          });
        } catch (error) {
          console.warn(`Failed to stat ${fullPath}:`, error);
        }
      }

      return fileEntries;
    } catch (error) {
      console.error(`Failed to read directory ${dirPath}:`, error);
      throw error;
    }
  }

  private async searchFiles(query: SearchQuery): Promise<SearchResult[]> {
    // TODO: Implement RipGrep integration
    // For now, return mock results based on the query
    console.log('Search query:', query);

    // This is a placeholder implementation
    // In Phase 3, we'll replace this with actual RipGrep integration
    return [];
  }

  private async selectDirectory(): Promise<string | null> {
    if (!this.mainWindow) return null;

    const result = await dialog.showOpenDialog(this.mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Directory to Search'
    });

    return result.canceled ? null : result.filePaths[0];
  }
}

// Initialize the application
new FAInderApp();
