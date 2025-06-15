#!/usr/bin/env node

/**
 * Development script for the Electron app
 * This script helps coordinate the development workflow
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const NEXT_PROJECT_PATH = path.join(__dirname, '..', '..', 'project-1749984823338');
const ELECTRON_APP_PATH = path.join(__dirname, '..');

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

function checkDependencies() {
  log('Checking dependencies...');
  
  // Check if Next.js project exists
  if (!fs.existsSync(NEXT_PROJECT_PATH)) {
    log('Next.js project not found!', 'error');
    process.exit(1);
  }
  
  // Check if Next.js node_modules exists
  const nextNodeModules = path.join(NEXT_PROJECT_PATH, 'node_modules');
  if (!fs.existsSync(nextNodeModules)) {
    log('Next.js dependencies not installed. Run: cd ../project-1749984823338 && npm install', 'error');
    process.exit(1);
  }
  
  // Check if Electron node_modules exists
  const electronNodeModules = path.join(ELECTRON_APP_PATH, 'node_modules');
  if (!fs.existsSync(electronNodeModules)) {
    log('Electron dependencies not installed. Run: npm install', 'error');
    process.exit(1);
  }
  
  log('Dependencies check passed!', 'success');
}

function startNextDev() {
  return new Promise((resolve, reject) => {
    log('Starting Next.js development server...');
    
    const nextProcess = spawn('npm', ['run', 'dev'], {
      cwd: NEXT_PROJECT_PATH,
      stdio: 'pipe',
      shell: true
    });
    
    nextProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Ready')) {
        log('Next.js development server is ready!', 'success');
        resolve(nextProcess);
      }
      // Forward Next.js output
      process.stdout.write(`[Next.js] ${output}`);
    });
    
    nextProcess.stderr.on('data', (data) => {
      process.stderr.write(`[Next.js Error] ${data}`);
    });
    
    nextProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Next.js process exited with code ${code}`));
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      reject(new Error('Next.js server startup timeout'));
    }, 30000);
  });
}

function buildElectron() {
  return new Promise((resolve, reject) => {
    log('Building Electron TypeScript code...');
    
    const buildProcess = spawn('npm', ['run', 'build:electron'], {
      cwd: ELECTRON_APP_PATH,
      stdio: 'pipe',
      shell: true
    });
    
    buildProcess.stdout.on('data', (data) => {
      process.stdout.write(`[Vite] ${data}`);
    });
    
    buildProcess.stderr.on('data', (data) => {
      process.stderr.write(`[Vite Error] ${data}`);
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        log('Electron build completed!', 'success');
        resolve();
      } else {
        reject(new Error(`Electron build failed with code ${code}`));
      }
    });
  });
}

function startElectron() {
  log('Starting Electron...');
  
  const electronProcess = spawn('npm', ['start'], {
    cwd: ELECTRON_APP_PATH,
    stdio: 'inherit',
    shell: true
  });
  
  electronProcess.on('close', (code) => {
    log(`Electron exited with code ${code}`);
    process.exit(code);
  });
  
  return electronProcess;
}

async function main() {
  try {
    checkDependencies();
    
    // Start Next.js dev server
    const nextProcess = await startNextDev();
    
    // Build Electron code
    await buildElectron();
    
    // Start Electron
    const electronProcess = startElectron();
    
    // Handle cleanup
    process.on('SIGINT', () => {
      log('Shutting down...');
      nextProcess.kill();
      electronProcess.kill();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      log('Shutting down...');
      nextProcess.kill();
      electronProcess.kill();
      process.exit(0);
    });
    
  } catch (error) {
    log(`Error: ${error.message}`, 'error');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, checkDependencies, startNextDev, buildElectron, startElectron };
