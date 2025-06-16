# Application Icons

This directory contains the application icons for different platforms.

## Required Icons

### Windows
- `icon.ico` - Windows icon file (16x16, 32x32, 48x48, 256x256)

### macOS
- `icon.icns` - macOS icon file (multiple resolutions)

### Linux
- `icon.png` - PNG icon (512x512 recommended)

## Icon Guidelines

- **Design**: Simple, recognizable design that works at small sizes
- **Colors**: Use the fAInder brand colors
- **Format**: Vector-based design for scalability
- **Background**: Transparent background for PNG files

## Generating Icons

You can use tools like:
- **electron-icon-builder** - Generate all formats from a single PNG
- **Figma/Sketch** - Design and export multiple formats
- **ImageMagick** - Convert between formats

## Current Status

🚧 **Placeholder icons needed** - The application currently uses default Electron icons.

To add proper icons:
1. Create or obtain a high-resolution (1024x1024) PNG icon
2. Generate platform-specific formats
3. Place them in this directory
4. Update the build configuration in `package.json`
