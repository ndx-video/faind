// Renderer process utilities for the Electron app
// This file provides additional functionality for the renderer process

export interface SearchQuery {
  text?: string;
  fileType?: string;
  folder?: string;
  dateAfter?: Date;
  size?: string;
  regex?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  path: string;
  size: string;
  modified: string;
  matches: number;
}

export class ElectronRenderer {
  private isElectron: boolean;

  constructor() {
    this.isElectron = typeof window.electronAPI !== 'undefined';
    this.init();
  }

  private init(): void {
    if (!this.isElectron) {
      console.log('Running in web browser mode');
      return;
    }

    console.log('Running in Electron mode');
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.setupOnlookIntegration();
  }

  private setupEventListeners(): void {
    if (!this.isElectron) return;

    // Listen for menu events
    window.electronAPI.onNewSearch(() => {
      this.handleNewSearch();
    });

    window.electronAPI.onShowPreferences(() => {
      this.handleShowPreferences();
    });

    // Handle window controls (if custom titlebar is used)
    this.setupWindowControls();
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      // Cmd/Ctrl + N for new search
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        this.handleNewSearch();
      }

      // Cmd/Ctrl + , for preferences
      if ((event.metaKey || event.ctrlKey) && event.key === ',') {
        event.preventDefault();
        this.handleShowPreferences();
      }

      // Escape to close modals
      if (event.key === 'Escape') {
        this.handleEscape();
      }
    });
  }

  private setupWindowControls(): void {
    // Add window control buttons if using custom titlebar
    const titlebar = document.querySelector('.drag-region') as HTMLElement;
    if (titlebar) {
      titlebar.style.webkitAppRegion = 'drag';
      
      // Make buttons non-draggable
      const buttons = titlebar.querySelectorAll('button');
      buttons.forEach(button => {
        (button as HTMLElement).style.webkitAppRegion = 'no-drag';
      });
    }
  }

  private setupOnlookIntegration(): void {
    if (typeof window.onlookAPI !== 'undefined') {
      console.log('Onlook API available');
      
      // Set up live reload listener
      window.onlookAPI.onReload(() => {
        console.log('Onlook triggered reload');
        window.location.reload();
      });
    }
  }

  private handleNewSearch(): void {
    // Trigger new search in the React app
    const event = new CustomEvent('electron:new-search');
    window.dispatchEvent(event);
  }

  private handleShowPreferences(): void {
    // Trigger preferences modal in the React app
    const event = new CustomEvent('electron:show-preferences');
    window.dispatchEvent(event);
  }

  private handleEscape(): void {
    // Handle escape key for closing modals
    const event = new CustomEvent('electron:escape');
    window.dispatchEvent(event);
  }

  // File operations
  public async openFile(): Promise<string | undefined> {
    if (!this.isElectron) return undefined;
    return await window.electronAPI.openFile();
  }

  public async openFolder(): Promise<string | undefined> {
    if (!this.isElectron) return undefined;
    return await window.electronAPI.openFolder();
  }

  public async showInFolder(path: string): Promise<void> {
    if (!this.isElectron) return;
    return await window.electronAPI.showInFolder(path);
  }

  // Search operations
  public async searchFiles(query: SearchQuery): Promise<SearchResult[]> {
    if (!this.isElectron) return [];
    
    // Convert SearchQuery to string for now
    // TODO: Implement proper search query handling
    const queryString = JSON.stringify(query);
    return await window.electronAPI.searchFiles(queryString);
  }

  // Window operations
  public async minimizeWindow(): Promise<void> {
    if (!this.isElectron) return;
    return await window.electronAPI.minimize();
  }

  public async maximizeWindow(): Promise<void> {
    if (!this.isElectron) return;
    return await window.electronAPI.maximize();
  }

  public async closeWindow(): Promise<void> {
    if (!this.isElectron) return;
    return await window.electronAPI.close();
  }

  // Utility methods
  public getPlatform(): NodeJS.Platform | 'web' {
    return this.isElectron ? window.electronAPI.platform : 'web';
  }

  public isMac(): boolean {
    return this.getPlatform() === 'darwin';
  }

  public isWindows(): boolean {
    return this.getPlatform() === 'win32';
  }

  public isLinux(): boolean {
    return this.getPlatform() === 'linux';
  }

  public isElectronApp(): boolean {
    return this.isElectron;
  }

  // Event listeners management
  public addEventListener(event: string, callback: EventListener): void {
    window.addEventListener(event, callback);
  }

  public removeEventListener(event: string, callback: EventListener): void {
    window.removeEventListener(event, callback);
  }

  // Cleanup
  public cleanup(): void {
    if (this.isElectron) {
      window.electronAPI.removeAllListeners('new-search');
      window.electronAPI.removeAllListeners('show-preferences');
    }
  }
}

// Initialize the renderer when DOM is loaded
let electronRenderer: ElectronRenderer;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    electronRenderer = new ElectronRenderer();
    (window as any).electronRenderer = electronRenderer;
  });
} else {
  electronRenderer = new ElectronRenderer();
  (window as any).electronRenderer = electronRenderer;
}

// Export for use in React components
export default ElectronRenderer;
