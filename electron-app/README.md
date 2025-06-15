# fAInd Electron App (TypeScript + Vite)

This directory contains the Electron wrapper for the fAInd application, built with TypeScript and Vite for optimal development experience and type safety.

## Architecture

The Electron app is designed to work alongside the existing Next.js application without modifying its structure:

- **electron-app/**: Contains all Electron-specific files (TypeScript + Vite)
- **project-1749984823338/**: Original Next.js application (unchanged)

## Technology Stack

- **TypeScript**: Full type safety and better IDE support
- **Vite**: Fast development builds and modern tooling
- **Electron**: Desktop application framework
- **ESLint**: Code linting with TypeScript support

## Development Setup

### Prerequisites

1. Ensure the Next.js app dependencies are installed:

   ```bash
   cd ../project-1749984823338
   npm install
   ```

2. Install Electron app dependencies:

   ```bash
   npm install
   ```

### Development Mode

**Option 1: Quick Start (Recommended)**

```bash

## Build and start Electron (assumes Next.js is already running on localhost:3000)

npm run dev

```

**Option 2: Using Batch File (Windows)**

```bash

## Double-click or run from command prompt

start.cmd

```

**Option 3: Using PowerShell Script**

```powershell

## Run from PowerShell

.\start.ps1

```

**Option 4: Manual Steps**

```bash

## 1. Build TypeScript

npm run build:electron

## 2. Start Electron

npx electron .

```

This will:

1. Compile the TypeScript code with Vite
2. Launch Electron pointing to localhost:3000
3. Show debug information in the console

### Production Build

Build the application for distribution:

```bash

npm run build

```

This will:

1. Build the Next.js application
2. Compile TypeScript to JavaScript with Vite
3. Package everything with Electron Builder

### Available Scripts

- `npm start` - Start Electron (requires Next.js to be running separately)
- `npm run dev` - Start both Next.js dev server and Electron with hot reload
- `npm run dev:electron` - Build Electron code and start Electron only
- `npm run dev:next` - Start only the Next.js dev server
- `npm run build` - Build both Next.js and Electron app
- `npm run build:electron` - Build only the Electron TypeScript code
- `npm run build:next` - Build only the Next.js app
- `npm run dist` - Create distributable packages
- `npm run pack` - Create unpacked app directory
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint on TypeScript files

## File Structure

```

electron-app/
├── src/
│   ├── main.ts          # Main Electron process (TypeScript)
│   ├── preload.ts       # Preload script with type definitions
│   ├── renderer.ts      # Renderer process utilities
│   └── types.ts         # Shared type definitions
├── dist/                # Compiled JavaScript output (generated)
├── release/             # Built application packages (generated)
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── .eslintrc.js         # ESLint configuration
├── package.json         # Electron app configuration
└── README.md           # This file

```

## TypeScript Benefits

### Type Safety

- Full type checking for Electron APIs
- Compile-time error detection
- Better refactoring support

### IDE Support

- IntelliSense and auto-completion
- Go-to-definition and find references
- Inline documentation

### Code Quality

- Enforced coding standards with ESLint
- Consistent code formatting
- Better maintainability

## Vite Benefits

### Fast Development

- Lightning-fast hot module replacement (HMR)
- Instant server start
- Optimized development builds

### Modern Tooling

- ES modules support
- Tree shaking
- Built-in TypeScript support

### Build Optimization

- Efficient bundling
- Code splitting
- Asset optimization

## Integration with Onlook

The Electron wrapper maintains full compatibility with Onlook:

1. **Live Editing**: Onlook can still modify components on localhost:3000
2. **Type-Safe APIs**: Secure file system access with TypeScript interfaces
3. **Hot Reloading**: Changes made through Onlook are reflected immediately
4. **Development Mode**: Seamless integration with the development workflow

## Security Features

The Electron app follows security best practices:

- **Context Isolation**: Enabled for all renderer processes
- **Node Integration**: Disabled in renderer processes
- **Preload Scripts**: Controlled API exposure with TypeScript interfaces
- **Web Security**: Enabled in production builds
- **External Links**: Proper handling of external navigation
- **Type Safety**: Compile-time validation of all API calls

## Platform Support

The app is configured to build for:

- **macOS**: DMG installer (x64 and ARM64)
- **Windows**: NSIS installer (x64)
- **Linux**: AppImage (x64)

## Configuration

### TypeScript Configuration

The `tsconfig.json` is configured for:

- ES2022 target for modern JavaScript features
- Strict type checking
- Path mapping for clean imports
- Declaration file generation

### Vite Configuration

The `vite.config.ts` includes:

- Multi-entry build (main and preload)
- CommonJS output for Electron compatibility
- External Electron modules
- Development source maps

### ESLint Configuration

Configured with:

- TypeScript-specific rules
- Electron-friendly settings
- Code quality enforcement

## Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit TypeScript files in `src/`
3. **Hot Reload**: Vite automatically rebuilds and reloads
4. **Type Check**: `npm run type-check` for validation
5. **Lint Code**: `npm run lint` for code quality
6. **Build**: `npm run build` for production

## Troubleshooting

### Development Issues

1. **TypeScript Errors**: Run `npm run type-check` to see all issues
2. **Build Failures**: Check Vite output for compilation errors
3. **Port Conflicts**: Ensure localhost:3000 is available
4. **Module Resolution**: Verify path mappings in `tsconfig.json`

### Build Issues

1. **Type Errors**: Fix all TypeScript errors before building
2. **Missing Dependencies**: Ensure all imports are properly typed
3. **Vite Configuration**: Check `vite.config.ts` for build settings
4. **Electron Builder**: Verify `package.json` build configuration

## Contributing

When making changes:

1. **Use TypeScript**: All new code should be in TypeScript
2. **Follow Types**: Use the defined interfaces in `types.ts`
3. **Maintain Structure**: Keep Electron files in `electron-app/src/`
4. **Test Builds**: Verify both development and production builds
5. **Type Safety**: Ensure all code passes type checking
6. **Code Quality**: Run linting before committing
7. **Onlook Compatibility**: Test with Onlook integration

## Future Enhancements

Potential improvements:

- Hot reload for main process during development
- Automated testing with Jest and Electron
- CI/CD pipeline for automated builds
- Advanced file search implementation
- Settings persistence with type-safe storage
- Plugin system for extensibility
