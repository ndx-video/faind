/**
 * Renderer utilities for the fAInder Electron application
 * This file contains helper functions and utilities for the renderer process
 */

import type { ElectronAPI, OnlookAPI } from './types.js';

/**
 * Type-safe access to Electron APIs
 */
export function getElectronAPI(): ElectronAPI {
  if (!window.electronAPI) {
    throw new Error('Electron API not available. Make sure the preload script is loaded.');
  }
  return window.electronAPI;
}

/**
 * Type-safe access to Onlook APIs
 */
export function getOnlookAPI(): OnlookAPI {
  if (!window.onlookAPI) {
    throw new Error('Onlook API not available. Make sure the preload script is loaded.');
  }
  return window.onlookAPI;
}

/**
 * Check if running in Electron environment
 */
export function isElectron(): boolean {
  return typeof window !== 'undefined' && !!window.electronAPI;
}

/**
 * Check if Onlook integration is available
 */
export function isOnlookAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.onlookAPI;
}

/**
 * Get platform information
 */
export function getPlatformInfo() {
  if (!isElectron()) {
    return {
      platform: 'web',
      isElectron: false,
      versions: {}
    };
  }

  // Access debug info if available (development only)
  const debug = (window as any).electronDebug;
  
  return {
    platform: debug?.platform || 'unknown',
    isElectron: true,
    versions: debug?.versions || {},
    arch: debug?.arch || 'unknown',
    env: debug?.env || 'production'
  };
}

/**
 * Utility function to handle file operations with error handling
 */
export async function safeFileOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'File operation failed'
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance-sensitive operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Create a promise that resolves after a specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate file path
 */
export function isValidPath(path: string): boolean {
  if (!path || typeof path !== 'string') return false;
  
  // Basic path validation
  const invalidChars = /[<>:"|?*]/;
  return !invalidChars.test(path);
}

/**
 * Extract file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot > 0 ? filename.substring(lastDot + 1).toLowerCase() : '';
}

/**
 * Get file type category from extension
 */
export function getFileTypeCategory(extension: string): string {
  const ext = extension.toLowerCase();
  
  const categories: Record<string, string[]> = {
    'image': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'],
    'video': ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'],
    'audio': ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'],
    'document': ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
    'spreadsheet': ['xls', 'xlsx', 'csv', 'ods'],
    'presentation': ['ppt', 'pptx', 'odp'],
    'archive': ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
    'code': ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'h', 'php', 'rb', 'go', 'rs', 'swift', 'kt']
  };
  
  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(ext)) {
      return category;
    }
  }
  
  return 'other';
}
