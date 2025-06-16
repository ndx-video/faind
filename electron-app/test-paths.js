// Simple path testing script
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Path Testing ===');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('App path:', app.getAppPath());
console.log('Process resourcesPath:', process.resourcesPath);

// Test React app paths
const possiblePaths = [
  path.join(__dirname, '..', 'polymet-fainder', 'dist', 'index.html'),
  path.join(__dirname, '..', 'polymet-fainder', 'index.html'),
  path.join(process.cwd(), '..', 'polymet-fainder', 'dist', 'index.html'),
  path.join(process.cwd(), '..', 'polymet-fainder', 'index.html'),
];

console.log('\n=== Testing React App Paths ===');
possiblePaths.forEach((testPath, index) => {
  console.log(`${index + 1}. Testing: ${testPath}`);
  try {
    const exists = fs.existsSync(testPath);
    console.log(`   Exists: ${exists}`);
    if (exists) {
      const stats = fs.statSync(testPath);
      console.log(`   Is file: ${stats.isFile()}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
});

// Test preload script
const preloadPath = path.join(__dirname, 'dist', 'preload.js');
console.log('\n=== Testing Preload Script ===');
console.log('Preload path:', preloadPath);
console.log('Preload exists:', fs.existsSync(preloadPath));

// Test main script
const mainPath = path.join(__dirname, 'dist', 'main.js');
console.log('\n=== Testing Main Script ===');
console.log('Main path:', mainPath);
console.log('Main exists:', fs.existsSync(mainPath));

app.quit();
