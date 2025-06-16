# fAInder Desktop Application

This directory contains the Electron desktop wrapper for the fAInder application, providing native desktop functionality while preserving the React-based user interface.

## Architecture Overview

The fAInder desktop application follows a secure Electron architecture with:

- **Main Process** (`src/main.ts`): Manages windows, menus, and system integration
- **Preload Script** (`src/preload.ts`): Secure bridge between main and renderer processes
- **Renderer Process**: The React application from `../polymet-fainder/`
- **IPC Communication**: Type-safe inter-process communication for file operations

## Project Structure

```
electron-app/
├── src/
│   ├── main.ts              # Main Electron process
│   ├── preload.ts           # Secure IPC bridge
│   ├── renderer.ts          # Renderer utilities
│   ├── types.ts             # Shared type definitions
│   └── search/              # RipGrep integration (future)
├── scripts/
│   └── dev.js               # Development workflow script
├── assets/
│   └── icons/               # Application icons (future)
├── dist/                    # Built Electron files
├── package.json             # Electron dependencies and scripts
├── vite.config.ts           # Build configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- The React application in `../polymet-fainder/` must be set up

### Installation

```bash
# Install Electron app dependencies
cd electron-app
npm install

# Install React app dependencies (if not already done)
cd ../polymet-fainder
npm install
```

### Development Workflow

```bash
# Start development environment (from electron-app directory)
npm run dev
```

This command will:
1. Start the React development server on `http://localhost:5173`
2. Build the Electron main and preload scripts
3. Launch Electron with hot reloading enabled

### Manual Commands

```bash
# Build only the Electron scripts
npm run build:electron

# Build the React app
npm run build:react

# Build everything
npm run build

# Start Electron (after building)
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Security Features

The application implements Electron security best practices:

- **Context Isolation**: Enabled for all renderer processes
- **Node Integration**: Disabled in renderer processes
- **Preload Scripts**: Controlled API exposure with TypeScript interfaces
- **Web Security**: Enabled in production builds
- **External Links**: Proper handling of external navigation

## Available APIs

The preload script exposes the following APIs to the React application:

### File Operations
- `electronAPI.readDirectory(path)` - Read directory contents
- `electronAPI.searchFiles(query)` - Search for files (placeholder)
- `electronAPI.openFile(path)` - Open file with default application
- `electronAPI.showInFolder(path)` - Show file in system file manager
- `electronAPI.selectDirectory()` - Open directory selection dialog

### Application Operations
- `electronAPI.getAppVersion()` - Get application version
- `electronAPI.minimize()` - Minimize window
- `electronAPI.maximize()` - Maximize/restore window
- `electronAPI.close()` - Close window

### Preferences & State
- `electronAPI.getPreferences()` - Get user preferences
- `electronAPI.setPreferences(prefs)` - Update preferences
- `electronAPI.getWindowState()` - Get window state

### Event Listeners
- `electronAPI.onSearchProgress(callback)` - Listen for search progress
- `electronAPI.onIndexUpdate(callback)` - Listen for index updates
- `electronAPI.onFileChange(callback)` - Listen for file system changes

## Integration with React App

The Electron wrapper serves the React application from `../polymet-fainder/`. In development mode, it connects to the Vite dev server. In production, it serves the built React files.

### Detecting Electron Environment

```typescript
// In React components
if (window.electronAPI) {
  // Running in Electron
  const files = await window.electronAPI.readDirectory('/some/path');
} else {
  // Running in browser
  console.log('Web mode - some features unavailable');
}
```

### Using Electron APIs

```typescript
import { getElectronAPI, isElectron } from './renderer';

if (isElectron()) {
  const electronAPI = getElectronAPI();
  const files = await electronAPI.searchFiles({
    text: 'search term',
    fileTypes: ['txt', 'md']
  });
}
```

## Build and Distribution

### Development Build

```bash
npm run build
```

### Production Distribution

```bash
# Build for current platform
npm run dist

# Build for specific platforms
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

Built applications will be in the `release/` directory.

## Onlook Integration

The application supports Onlook visual editing through the `onlookAPI`:

- `onlookAPI.isElectron` - Always true in Electron
- `onlookAPI.readFile(path)` - Read file for editing
- `onlookAPI.writeFile(path, content)` - Write edited file
- `onlookAPI.onReload(callback)` - Listen for reload events

## Troubleshooting

### Common Issues

**Electron fails to start:**
- Ensure you're using `npx electron .` instead of direct electron commands
- Check that the React dev server is running on port 5173
- Verify all dependencies are installed

**TypeScript errors:**
- Run `npm run type-check` for detailed error information
- Ensure all imports use correct file extensions (.js for built files)

**Build failures:**
- Check Vite output for compilation errors
- Ensure all external modules are properly listed in vite.config.ts

### Development Tips

1. **Hot Reloading**: Changes to React components will hot reload automatically
2. **Electron Restart**: Changes to main.ts or preload.ts require restarting Electron
3. **Debugging**: Use `--enable-logging` flag for detailed Electron logs
4. **DevTools**: Press F12 or Ctrl+Shift+I to open Chrome DevTools

## Future Enhancements

- **RipGrep Integration**: Real file search functionality
- **File System Watching**: Real-time index updates
- **Auto-updater**: Automatic application updates
- **System Integration**: Context menus, file associations
- **Performance Optimization**: Search result caching and streaming

## Contributing

When making changes to the Electron application:

1. Follow TypeScript strict mode requirements
2. Update type definitions in `src/types.ts`
3. Test in both development and production builds
4. Ensure security best practices are maintained
5. Update this README for significant changes
