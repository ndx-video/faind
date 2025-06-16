const { contextBridge, ipcRenderer } = require('electron');

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

/**
 * Secure preload script that exposes limited APIs to the renderer process
 * This script runs in a privileged context but with context isolation enabled
 */

// Electron API implementation
const electronAPI: ElectronAPI = {
  // File system operations
  readDirectory: (path: string): Promise<FileEntry[]> => 
    ipcRenderer.invoke(IPC_CHANNELS.READ_DIRECTORY, path),
  
  searchFiles: (query: SearchQuery): Promise<SearchResult[]> => 
    ipcRenderer.invoke(IPC_CHANNELS.SEARCH_FILES, query),
  
  openFile: (path: string): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.OPEN_FILE, path),
  
  showInFolder: (path: string): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.SHOW_IN_FOLDER, path),
  
  selectDirectory: (): Promise<string | null> => 
    ipcRenderer.invoke(IPC_CHANNELS.SELECT_DIRECTORY),

  // Search engine operations (placeholder for Phase 3)
  indexDirectory: (path: string): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.INDEX_DIRECTORY, path),
  
  getSearchIndex: (): Promise<IndexStats> => 
    ipcRenderer.invoke(IPC_CHANNELS.GET_SEARCH_INDEX),
  
  clearIndex: (): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.CLEAR_INDEX),

  // Application operations
  getAppVersion: (): Promise<string> => 
    ipcRenderer.invoke(IPC_CHANNELS.GET_APP_VERSION),
  
  getAppPath: (): Promise<string> => 
    ipcRenderer.invoke(IPC_CHANNELS.GET_APP_PATH),
  
  quit: (): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.QUIT),
  
  minimize: (): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.MINIMIZE),
  
  maximize: (): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.MAXIMIZE),
  
  unmaximize: (): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.UNMAXIMIZE),
  
  close: (): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.CLOSE),

  // Preferences
  getPreferences: (): Promise<AppPreferences> => 
    ipcRenderer.invoke(IPC_CHANNELS.GET_PREFERENCES),
  
  setPreferences: (preferences: Partial<AppPreferences>): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.SET_PREFERENCES, preferences),

  // Window state
  getWindowState: (): Promise<WindowState> => 
    ipcRenderer.invoke(IPC_CHANNELS.GET_WINDOW_STATE),
  
  setWindowState: (state: Partial<WindowState>): Promise<void> => 
    ipcRenderer.invoke(IPC_CHANNELS.SET_WINDOW_STATE, state),

  // Event listeners
  onSearchProgress: (callback: (progress: SearchProgress) => void): void => {
    ipcRenderer.on(IPC_CHANNELS.SEARCH_PROGRESS, (_, progress) => callback(progress));
  },
  
  onIndexUpdate: (callback: (stats: IndexStats) => void): void => {
    ipcRenderer.on(IPC_CHANNELS.INDEX_UPDATE, (_, stats) => callback(stats));
  },
  
  onFileChange: (callback: (path: string, event: 'add' | 'change' | 'unlink') => void): void => {
    ipcRenderer.on(IPC_CHANNELS.FILE_CHANGE, (_, path, event) => callback(path, event));
  },

  // Remove listeners
  removeAllListeners: (channel: string): void => {
    ipcRenderer.removeAllListeners(channel);
  }
};

// Onlook API implementation for visual editing support
const onlookAPI: OnlookAPI = {
  isElectron: true,
  version: process.versions.electron || '0.0.0',
  
  readFile: (path: string): Promise<string | null> => 
    ipcRenderer.invoke(IPC_CHANNELS.ONLOOK_READ_FILE, path),
  
  writeFile: (path: string, content: string): Promise<boolean> => 
    ipcRenderer.invoke(IPC_CHANNELS.ONLOOK_WRITE_FILE, path, content),
  
  onReload: (callback: () => void): void => {
    ipcRenderer.on(IPC_CHANNELS.ONLOOK_RELOAD, callback);
  },
  
  triggerReload: (): void => {
    ipcRenderer.send(IPC_CHANNELS.ONLOOK_RELOAD);
  }
};

// Expose APIs to renderer process through context bridge
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
contextBridge.exposeInMainWorld('onlookAPI', onlookAPI);

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Expose additional debugging information in development
  contextBridge.exposeInMainWorld('electronDebug', {
    versions: process.versions,
    platform: process.platform,
    arch: process.arch,
    env: process.env.NODE_ENV
  });
}

// Log successful preload
console.log('fAInder preload script loaded successfully');
console.log('Electron version:', process.versions.electron);
console.log('Node version:', process.versions.node);
console.log('Chrome version:', process.versions.chrome);
