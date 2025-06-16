import { useState, useEffect } from 'react';

// Types for Electron API
export interface SearchQuery {
  text: string;
  fileTypes: string[];
  directories: string[];
  caseSensitive: boolean;
  maxResults: number;
}

export interface SearchResult {
  id: string;
  name: string;
  path: string;
  size: number;
  modified: Date;
  extension: string;
  type: string;
  matches?: Array<{ text: string; line: number; column: number }>;
}

export interface ElectronAPI {
  isElectron: boolean;
  searchFiles?: (query: SearchQuery) => Promise<SearchResult[]>;
  selectDirectory?: () => Promise<string | null>;
  openFile?: (path: string) => Promise<void>;
  showInFolder?: (path: string) => Promise<void>;
  appVersion?: string;
}

// Hook to access Electron APIs
export function useElectron(): ElectronAPI {
  const [electronAPI, setElectronAPI] = useState<ElectronAPI>({
    isElectron: false
  });

  useEffect(() => {
    // Check if we're running in Electron
    const isElectronEnv = !!(window as any).electronAPI;
    
    if (isElectronEnv) {
      const api = (window as any).electronAPI;
      
      setElectronAPI({
        isElectron: true,
        searchFiles: api.searchFiles,
        selectDirectory: api.selectDirectory,
        openFile: api.openFile,
        showInFolder: api.showInFolder,
        appVersion: api.appVersion || '1.0.0'
      });
    } else {
      setElectronAPI({
        isElectron: false
      });
    }
  }, []);

  return electronAPI;
}
