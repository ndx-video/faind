# Agentic Guide for fAInd Project

This guide provides AI agents with comprehensive technical details about the fAInd project structure, architecture, and development workflow.

## Project Overview

**fAInd** is an AI-powered file search application with both web and desktop interfaces:

- **Web Interface**: Next.js React application for browser-based usage
- **Desktop Interface**: Electron wrapper for native desktop experience
- **Live Editing**: Integration with Onlook for visual component editing

## Repository Structure

```
faind/
├── project-1749984823338/          # Onlook Next.js Application
│   ├── app/                        # Next.js App Router structure
│   │   ├── page.tsx               # Main search interface
│   │   ├── layout.tsx             # Root layout component
│   │   ├── globals.css            # Global styles
│   │   └── favicon.ico            # App icon
│   ├── lib/                       # Utility libraries
│   │   └── utils.ts               # Shared utility functions
│   ├── public/                    # Static assets
│   │   └── images/                # Image assets
│   ├── package.json               # Next.js dependencies
│   ├── tsconfig.json              # TypeScript configuration
│   ├── tailwind.config.ts         # Tailwind CSS configuration
│   ├── next.config.mjs            # Next.js configuration
│   └── components.json            # UI component configuration
├── electron-app/                   # Electron Desktop Wrapper
│   ├── src/                       # TypeScript source files
│   │   ├── main.ts                # Main Electron process
│   │   ├── preload.ts             # Secure renderer bridge
│   │   ├── renderer.ts            # Renderer utilities
│   │   └── types.ts               # Shared type definitions
│   ├── scripts/                   # Development scripts
│   │   └── dev.js                 # Development workflow helper
│   ├── assets/                    # App icons and resources
│   ├── vite.config.ts             # Vite build configuration
│   ├── tsconfig.json              # TypeScript configuration
│   ├── package.json               # Electron dependencies
│   └── README.md                  # Electron-specific documentation
├── .gitignore                     # Git ignore rules (optimized)
├── ELECTRON_SETUP.md              # Electron implementation guide
├── AGENTIC_GUIDE.md               # This file
└── PROJECT_PLAN.md                # Project roadmap and milestones

```

## Technology Stack

### Frontend (Next.js Application)

- **Framework**: Next.js 14.2.23 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)

### Desktop (Electron Application)

- **Framework**: Electron 28.0.0
- **Language**: TypeScript
- **Build Tool**: Vite 5.0.0
- **Security**: Context isolation, no Node integration in renderer
- **Architecture**: Main process + Renderer process with secure IPC

### Development Tools

- **Package Manager**: npm (with lock files for reproducibility)
- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier
- **Type Checking**: TypeScript strict mode

## Key Components and Architecture

### Next.js Application Structure

#### Main Search Interface (`app/page.tsx`)

- **Component Type**: Client-side React component
- **State Management**: Multiple useState hooks for search state
- **Key Features**:
  - Dynamic search block system
  - File type filtering
  - Search presets
  - AI suggestions
  - Results display with metadata

#### Search Block System

```typescript

interface SearchBlock {
  id: number;
  type: 'text' | 'filetype' | 'folder' | 'date' | 'size' | 'regex';
  label: string;
  value: string;
  placeholder: string;
}

```

#### Search Results Structure

```typescript

interface SearchResult {
  id: number;
  name: string;
  path: string;
  size: string;
  modified: string;
  matches: number;
}

```

### Electron Application Architecture

#### Main Process (`src/main.ts`)

- **Responsibilities**: Window management, menu creation, IPC handling
- **Security**: Implements Electron security best practices
- **Features**: Auto-updater, platform-specific menus, file operations

#### Preload Script (`src/preload.ts`)

- **Purpose**: Secure bridge between main and renderer processes
- **APIs Exposed**: File operations, search functions, Onlook integration
- **Security**: Context isolation with typed interfaces

#### Type System (`src/types.ts`)

- **Comprehensive Types**: All interfaces for type safety
- **API Definitions**: ElectronAPI and OnlookAPI interfaces
- **Data Models**: Search queries, results, preferences

## Development Workflow

### Starting Development

```bash

## Install dependencies for both projects

cd project-1749984823338 && npm install
cd ../electron-app && npm install

## Start development environment

cd electron-app
npm run dev  # Starts both Next.js and Electron

```

### Build Process

```bash

## Build for production

cd electron-app
npm run build  # Builds Next.js then Electron app

```

### Code Quality

```bash

## Type checking

npm run type-check

## Linting

npm run lint

## Format code (if Prettier is configured)

npm run format

```

## Onlook Integration

### Purpose

Onlook is a visual editor that allows real-time modification of React components without code changes.

### Integration Points

1. **Development Server**: Onlook connects to localhost:3000
2. **File Structure**: Original Next.js files preserved for Onlook compatibility
3. **Live Editing**: Changes made in Onlook reflect immediately in both web and Electron
4. **API Bridge**: Secure file system access through Electron preload script

### Onlook API (`src/preload.ts`)

```typescript

interface OnlookAPI {
  isElectron: boolean;
  version: string;
  readFile: (path: string) => Promise<string | null>;
  writeFile: (path: string, content: string) => Promise<boolean>;
  onReload: (callback: () => void) => void;
  triggerReload: () => void;
}

```

## File Search Implementation

### Current Implementation

- **Mock Data**: Currently uses simulated search results
- **Search Types**: Text, file type, folder, date, size, regex filters
- **UI Features**: Block-based query builder, preset saving, AI suggestions

### Search Architecture (Future Implementation)

```typescript

interface SearchEngine {
  indexFiles(directory: string): Promise<void>;
  search(query: SearchQuery): Promise<SearchResult[]>;
  updateIndex(changedFiles: string[]): Promise<void>;
}

interface SearchQuery {
  text?: string;
  fileTypes?: string[];
  directories?: string[];
  dateRange?: { start: Date; end: Date };
  sizeRange?: { min: number; max: number };
  regex?: string;
  caseSensitive?: boolean;
}

```

## Security Considerations

### Electron Security

- **Context Isolation**: Enabled for all renderer processes
- **Node Integration**: Disabled in renderer processes
- **Preload Scripts**: Controlled API exposure with TypeScript interfaces
- **Web Security**: Enabled in production builds
- **External Links**: Proper handling of external navigation

### File System Access

- **Controlled Access**: Only through secure IPC channels
- **Path Validation**: Prevent directory traversal attacks
- **Permission Checks**: Verify file access permissions

## Configuration Management

### Environment Variables

- **Development**: `.env.local` for local overrides
- **Production**: Environment-specific configurations
- **Security**: Sensitive data never committed to repository

### Build Configurations

- **Next.js**: `next.config.mjs` for framework settings
- **Electron**: `package.json` build section for packaging
- **TypeScript**: Strict mode enabled for type safety
- **Vite**: Optimized for Electron main/preload builds

## Testing Strategy (Future Implementation)

### Unit Testing

- **Framework**: Jest with TypeScript support
- **Coverage**: Components, utilities, search logic
- **Mocking**: File system operations, Electron APIs

### Integration Testing

- **Electron**: Spectron or similar for desktop app testing
- **Next.js**: Playwright for web interface testing
- **Cross-Platform**: Test on Windows, macOS, Linux

### End-to-End Testing

- **User Workflows**: Complete search scenarios
- **Onlook Integration**: Visual editing workflows
- **Performance**: Search speed and memory usage

## Performance Considerations

### Search Performance

- **Indexing**: Background file system indexing
- **Caching**: Search result caching with invalidation
- **Streaming**: Large result set streaming
- **Debouncing**: Search input debouncing

### Memory Management

- **Electron**: Proper cleanup of renderer processes
- **File Watching**: Efficient file system monitoring
- **Result Pagination**: Limit memory usage for large result sets

## Common Development Patterns

### Adding New Search Filters

1. Update `SearchBlock` type in relevant files
2. Add UI components for the new filter type
3. Implement backend search logic
4. Update TypeScript interfaces
5. Add tests for new functionality

### Extending Electron APIs

1. Define new IPC channels in main process
2. Add handlers in `src/main.ts`
3. Expose APIs in `src/preload.ts`
4. Update TypeScript interfaces in `src/types.ts`
5. Document new APIs

### Modifying UI Components

1. Edit components in `project-1749984823338/app/`
2. Test with Onlook for visual verification
3. Ensure TypeScript compliance
4. Test in both web and Electron environments

## Troubleshooting Common Issues

### Development Environment

- **Port Conflicts**: Ensure localhost:3000 is available
- **TypeScript Errors**: Run `npm run type-check` for details
- **Build Failures**: Check Vite output for compilation errors
- **Onlook Connection**: Verify Next.js dev server is running

### Production Builds

- **Missing Dependencies**: Ensure all imports are properly typed
- **Path Issues**: Use proper path resolution for cross-platform compatibility
- **Packaging Errors**: Check Electron Builder configuration

### Electron Launch Issues (Windows)

**Problem**: Electron may fail to launch due to PowerShell path resolution issues, showing "Cannot find module" errors.

**Solution**: Use `npx electron .` instead of direct electron commands:

```bash
# Working method
npx electron . --enable-logging

# Alternative methods
npm run dev          # Uses npx internally
.\start.cmd         # Batch file launcher
.\start.ps1         # PowerShell script launcher
```

**Key Fixes Applied**:
- Updated package.json scripts to use `npx electron .`
- Changed path resolution from `join()` to `resolve()` for absolute paths
- Added debug logging to troubleshoot path issues
- Created multiple launcher scripts for different environments

## Development Tools & Scripts

### Markdown Linting Fix Script (`fix-markdown.js`)

A utility script to automatically fix common markdown linting issues across all `.md` files in the project.

#### Purpose

- **Automated Fixes**: Resolves markdownlint violations automatically
- **Consistency**: Ensures all documentation follows the same formatting standards
- **Time Saving**: Eliminates manual markdown formatting work
- **Quality Assurance**: Maintains professional documentation standards

#### Usage

```bash

## Run from the project root directory

node fix-markdown.js

## Or use the npm script (recommended)

npm run fix-markdown

## Clean up backup files after reviewing changes

npm run clean-backups

```

#### What It Fixes

- **MD022**: Adds missing blank lines around headings
- **MD032**: Ensures lists are surrounded by blank lines
- **MD031**: Adds blank lines around fenced code blocks
- **MD040**: Adds language specifications to code fences
- **MD025**: Converts duplicate top-level headings to second-level
- **MD009**: Removes trailing whitespace
- **MD047**: Ensures files end with newlines

#### Features

- **Automatic Backup**: Creates `.backup` files before making changes
- **Comprehensive Scanning**: Processes all `.md` files in the project
- **Detailed Reporting**: Shows exactly what was fixed in each file
- **Safe Operation**: Non-destructive with backup creation
- **Smart Detection**: Uses heuristics to detect code block languages

#### When to Use

- **After Major Edits**: Run after significant documentation changes
- **Before Commits**: Ensure clean markdown before version control
- **Regular Maintenance**: Periodic cleanup of documentation
- **New File Creation**: After adding new markdown files

#### Example Output

```bash

📝 Processing: README.md
   💾 Created backup: README.md.backup
   ✅ Applied 5 fixes:
      • Added blank line before heading: "## Key Features"
      • Added blank line after list ending with: "Cross-platform compatibility"
      • Added language 'bash' to code fence
      • Removed trailing whitespace from line 45
      • Added final newline to file

```

## Best Practices for AI Agents

### Code Modifications

1. **Preserve Structure**: Don't move or rename existing Onlook files
2. **Type Safety**: Always maintain TypeScript compliance
3. **Security**: Follow Electron security best practices
4. **Testing**: Verify changes in both web and desktop environments

### File Operations

1. **Use Package Managers**: Never manually edit package.json
2. **Respect .gitignore**: Don't commit build artifacts or dependencies
3. **Path Handling**: Use cross-platform path utilities
4. **Backup Important Files**: Before major structural changes

### Documentation

1. **Update This Guide**: When adding new features or changing architecture
2. **Code Comments**: Document complex logic and security considerations
3. **Type Definitions**: Keep interfaces up-to-date with implementations
4. **README Updates**: Maintain accurate setup and usage instructions
5. **Markdown Quality**: Run `node fix-markdown.js` after major documentation edits

### Documentation Workflow

1. **Edit Documentation**: Make changes to markdown files as needed
2. **Fix Formatting**: Run `node fix-markdown.js` to ensure compliance
3. **Review Changes**: Check the fixes applied and backup files created
4. **Commit Changes**: Add the cleaned markdown files to version control
5. **Clean Backups**: Remove `.backup` files after confirming changes

This guide should be updated whenever significant architectural changes are made to the project.
