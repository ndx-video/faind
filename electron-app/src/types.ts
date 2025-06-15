// Type definitions for the Electron app

export interface AppConfig {
  name: string;
  version: string;
  description: string;
  author: string;
}

export interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized?: boolean;
  isFullScreen?: boolean;
}

export interface SearchQuery {
  text?: string;
  fileType?: string;
  folder?: string;
  dateAfter?: Date;
  dateBefore?: Date;
  size?: string;
  regex?: string;
  caseSensitive?: boolean;
}

export interface SearchResult {
  id: string;
  name: string;
  path: string;
  size: string;
  modified: string;
  created: string;
  matches: number;
  type: 'file' | 'folder';
  extension?: string;
}

export interface SearchPreset {
  id: string;
  name: string;
  query: SearchQuery;
  lastUsed: Date;
  useCount: number;
}

export interface AppPreferences {
  defaultSearchDirectory: string;
  maxResults: number;
  caseSensitiveByDefault: boolean;
  showHiddenFiles: boolean;
  autoSavePresets: boolean;
  theme: 'light' | 'dark' | 'system';
  windowState: WindowState;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  modified: Date;
  created: Date;
  isDirectory: boolean;
  extension?: string;
  permissions?: {
    readable: boolean;
    writable: boolean;
    executable: boolean;
  };
}

export interface OnlookIntegration {
  isEnabled: boolean;
  port: number;
  autoReload: boolean;
  allowFileModification: boolean;
}

// Electron API types
export interface ElectronAPI {
  // App control
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  
  // File operations
  openFile: () => Promise<string | undefined>;
  openFolder: () => Promise<string | undefined>;
  showInFolder: (path: string) => Promise<void>;
  
  // Search operations
  searchFiles: (query: string) => Promise<SearchResult[]>;
  
  // Menu events
  onNewSearch: (callback: () => void) => void;
  onShowPreferences: (callback: () => void) => void;
  
  // System info
  platform: NodeJS.Platform;
  
  // Remove listeners
  removeAllListeners: (channel: string) => void;
}

export interface OnlookAPI {
  isElectron: boolean;
  version: string;
  readFile: (path: string) => Promise<string | null>;
  writeFile: (path: string, content: string) => Promise<boolean>;
  onReload: (callback: () => void) => void;
  triggerReload: () => void;
}

// Menu template types
export interface MenuTemplate {
  label: string;
  submenu?: MenuItemTemplate[];
  role?: string;
  type?: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';
  click?: () => void;
  accelerator?: string;
  enabled?: boolean;
  visible?: boolean;
}

export interface MenuItemTemplate {
  label?: string;
  role?: string;
  type?: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';
  click?: () => void;
  accelerator?: string;
  enabled?: boolean;
  visible?: boolean;
  checked?: boolean;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface SearchError extends AppError {
  query: SearchQuery;
  searchPath?: string;
}

// Event types
export interface AppEvent {
  type: string;
  data?: any;
  timestamp: Date;
}

export interface SearchEvent extends AppEvent {
  type: 'search:start' | 'search:progress' | 'search:complete' | 'search:error';
  query: SearchQuery;
  results?: SearchResult[];
  error?: SearchError;
  progress?: number;
}

// Global window interface extensions
declare global {
  interface Window {
    electronAPI: ElectronAPI;
    onlookAPI: OnlookAPI;
    electronRenderer: import('./renderer').ElectronRenderer;
  }
}
