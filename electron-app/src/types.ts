/**
 * Shared type definitions for the fAInder Electron application
 */

// Search-related types
export interface SearchQuery {
  text?: string;
  fileTypes?: string[];
  directories?: string[];
  excludePaths?: string[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  regex?: string;
  caseSensitive?: boolean;
  includeHidden?: boolean;
  maxResults?: number;
}

export interface SearchResult {
  id: string;
  name: string;
  path: string;
  absolutePath: string;
  size: number;
  modified: Date;
  created: Date;
  type: string;
  extension: string;
  matches?: SearchMatch[];
  score?: number;
}

export interface SearchMatch {
  line: number;
  column: number;
  text: string;
  context?: string;
}

export interface FileEntry {
  name: string;
  path: string;
  absolutePath: string;
  isDirectory: boolean;
  size: number;
  modified: Date;
  created: Date;
  extension: string;
  permissions: {
    readable: boolean;
    writable: boolean;
    executable: boolean;
  };
}

export interface IndexStats {
  totalFiles: number;
  totalDirectories: number;
  indexedFiles: number;
  lastUpdated: Date;
  indexSize: number;
  isIndexing: boolean;
}

export interface SearchProgress {
  current: number;
  total: number;
  currentFile?: string;
  stage: 'scanning' | 'indexing' | 'searching';
}

// Application types
export interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  searchPaths: string[];
  excludePatterns: string[];
  maxFileSize: number;
  enableFileWatcher: boolean;
  searchTimeout: number;
  maxResults: number;
  showHiddenFiles: boolean;
  autoIndex: boolean;
}

export interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized: boolean;
  isFullScreen: boolean;
}

// IPC types
export interface ElectronAPI {
  // File system operations
  readDirectory: (path: string) => Promise<FileEntry[]>;
  searchFiles: (query: SearchQuery) => Promise<SearchResult[]>;
  openFile: (path: string) => Promise<void>;
  showInFolder: (path: string) => Promise<void>;
  selectDirectory: () => Promise<string | null>;
  
  // Search engine operations
  indexDirectory: (path: string) => Promise<void>;
  getSearchIndex: () => Promise<IndexStats>;
  clearIndex: () => Promise<void>;
  
  // Application operations
  getAppVersion: () => Promise<string>;
  getAppPath: () => Promise<string>;
  quit: () => Promise<void>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  unmaximize: () => Promise<void>;
  close: () => Promise<void>;
  
  // Preferences
  getPreferences: () => Promise<AppPreferences>;
  setPreferences: (preferences: Partial<AppPreferences>) => Promise<void>;
  
  // Window state
  getWindowState: () => Promise<WindowState>;
  setWindowState: (state: Partial<WindowState>) => Promise<void>;
  
  // Event listeners
  onSearchProgress: (callback: (progress: SearchProgress) => void) => void;
  onIndexUpdate: (callback: (stats: IndexStats) => void) => void;
  onFileChange: (callback: (path: string, event: 'add' | 'change' | 'unlink') => void) => void;
  
  // Remove listeners
  removeAllListeners: (channel: string) => void;
}

// Onlook integration types
export interface OnlookAPI {
  isElectron: boolean;
  version: string;
  readFile: (path: string) => Promise<string | null>;
  writeFile: (path: string, content: string) => Promise<boolean>;
  onReload: (callback: () => void) => void;
  triggerReload: () => void;
}

// Global window interface extensions
declare global {
  interface Window {
    electronAPI: ElectronAPI;
    onlookAPI: OnlookAPI;
  }
}

// IPC channel names
export const IPC_CHANNELS = {
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
} as const;

type IPCChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];

module.exports = {
  IPC_CHANNELS
};
