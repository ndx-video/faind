# Assets Directory

This directory contains application assets for the Electron app.

## App Icons

Add your application icons here:

- `icon.png` - Main application icon (512x512 recommended)
- `icon.ico` - Windows icon (multiple sizes: 16x16, 32x32, 48x48, 256x256)
- `icon.icns` - macOS icon (multiple sizes included)

## Icon Requirements

### PNG Icon (icon.png)

- Size: 512x512 pixels
- Format: PNG with transparency
- Used for: Linux AppImage and fallback

### Windows Icon (icon.ico)

- Sizes: 16x16, 32x32, 48x48, 256x256
- Format: ICO file with multiple sizes
- Used for: Windows executable and taskbar

### macOS Icon (icon.icns)

- Sizes: 16x16, 32x32, 128x128, 256x256, 512x512, 1024x1024
- Format: ICNS file with multiple sizes
- Used for: macOS app bundle and dock

## Creating Icons

You can use tools like:

- **Online converters**: Convert PNG to ICO/ICNS
- **ImageMagick**: Command-line tool for icon conversion
- **Electron Icon Maker**: NPM package for generating all formats
- **Adobe Illustrator/Photoshop**: Professional design tools

## Example Commands

Using ImageMagick to create icons from a source PNG:

```bash

## Create Windows ICO

magick icon-source.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico

## Create macOS ICNS (requires iconutil on macOS)

mkdir icon.iconset
sips -z 16 16 icon-source.png --out icon.iconset/icon_16x16.png
sips -z 32 32 icon-source.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32 icon-source.png --out icon.iconset/icon_32x32.png
sips -z 64 64 icon-source.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128 icon-source.png --out icon.iconset/icon_128x128.png
sips -z 256 256 icon-source.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256 icon-source.png --out icon.iconset/icon_256x256.png
sips -z 512 512 icon-source.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512 icon-source.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon-source.png --out icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset

```

## Current Status

Currently, no icons are provided. The application will use default Electron icons until custom icons are added.
