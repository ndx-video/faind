import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Type definitions for the exposed APIs
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
  searchFiles: (query: string) => Promise<any[]>;
  
  // Menu events
  onNewSearch: (callback: (event: IpcRendererEvent) => void) => void;
  onShowPreferences: (callback: (event: IpcRendererEvent) => void) => void;
  
  // System info
  platform: NodeJS.Platform;
  
  // Remove listeners
  removeAllListeners: (channel: string) => void;
}

export interface OnlookAPI {
  // Allow Onlook to communicate with the app
  isElectron: boolean;
  version: string;
  
  // File system access for Onlook (if needed)
  readFile: (path: string) => Promise<string | null>;
  writeFile: (path: string, content: string) => Promise<boolean>;
  
  // Live reload support
  onReload: (callback: (event: IpcRendererEvent) => void) => void;
  triggerReload: () => void;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  // App control
  minimize: () => ipcRenderer.invoke('app:minimize'),
  maximize: () => ipcRenderer.invoke('app:maximize'),
  close: () => ipcRenderer.invoke('app:close'),
  
  // File operations
  openFile: () => ipcRenderer.invoke('file:open'),
  openFolder: () => ipcRenderer.invoke('file:open-folder'),
  showInFolder: (path: string) => ipcRenderer.invoke('file:show-in-folder', path),
  
  // Search operations
  searchFiles: (query: string) => ipcRenderer.invoke('search:files', query),
  
  // Menu events
  onNewSearch: (callback: (event: IpcRendererEvent) => void) => 
    ipcRenderer.on('new-search', callback),
  onShowPreferences: (callback: (event: IpcRendererEvent) => void) => 
    ipcRenderer.on('show-preferences', callback),
  
  // System info
  platform: process.platform,
  
  // Remove listeners
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
};

// Expose a limited API for Onlook integration
const onlookAPI: OnlookAPI = {
  // Allow Onlook to communicate with the app
  isElectron: true,
  version: process.versions.electron,
  
  // File system access for Onlook (if needed)
  readFile: (path: string) => ipcRenderer.invoke('onlook:read-file', path),
  writeFile: (path: string, content: string) => 
    ipcRenderer.invoke('onlook:write-file', path, content),
  
  // Live reload support
  onReload: (callback: (event: IpcRendererEvent) => void) => 
    ipcRenderer.on('onlook:reload', callback),
  triggerReload: () => ipcRenderer.send('onlook:trigger-reload')
};

// Expose APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
contextBridge.exposeInMainWorld('onlookAPI', onlookAPI);

// Security: Remove access to Node.js APIs
delete (window as any).require;
delete (window as any).exports;
delete (window as any).module;

// Prevent access to Electron's remote module
(window as any).eval = (global as any).eval = function () {
  throw new Error('eval() is disabled for security reasons.');
};

// Log that preload script has loaded
console.log('Preload script loaded successfully');

// Declare global types for TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI;
    onlookAPI: OnlookAPI;
  }
}
