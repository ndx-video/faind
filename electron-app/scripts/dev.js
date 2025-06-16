#!/usr/bin/env node

/**
 * Development script for fAInder Electron application
 * This script manages the development workflow by:
 * 1. Starting the React development server (Vite)
 * 2. Building the Electron main and preload scripts
 * 3. Starting Electron with hot reloading
 */

import { spawn, exec } from 'child_process';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const reactAppPath = resolve(projectRoot, '..', 'polymet-fainder');

console.log('🔧 Development script paths:');
console.log('  Script dir:', __dirname);
console.log('  Project root:', projectRoot);
console.log('  React app path:', reactAppPath);

class DevServer {
  constructor() {
    this.processes = [];
    this.isShuttingDown = false;
    
    // Handle process termination
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
    process.on('exit', () => this.shutdown());
  }

  async start() {
    console.log('🚀 Starting fAInder development environment...\n');
    
    try {
      // Check if React app exists
      if (!existsSync(reactAppPath)) {
        console.error('❌ React app not found at:', reactAppPath);
        console.error('Please ensure the polymet-fainder directory exists.');
        process.exit(1);
      }

      // Step 1: Install dependencies if needed
      await this.checkDependencies();
      
      // Step 2: Start React development server
      await this.startReactServer();
      
      // Step 3: Build Electron scripts
      await this.buildElectron();
      
      // Step 4: Start Electron
      await this.startElectron();
      
    } catch (error) {
      console.error('❌ Failed to start development environment:', error);
      this.shutdown();
    }
  }

  async checkDependencies() {
    console.log('📦 Checking dependencies...');
    
    // Check React app dependencies
    if (!existsSync(join(reactAppPath, 'node_modules'))) {
      console.log('📦 Installing React app dependencies...');
      await this.runCommand('npm install', { cwd: reactAppPath });
    }
    
    // Check Electron app dependencies
    if (!existsSync(join(projectRoot, 'node_modules'))) {
      console.log('📦 Installing Electron app dependencies...');
      await this.runCommand('npm install', { cwd: projectRoot });
    }
    
    console.log('✅ Dependencies checked\n');
  }

  async startReactServer() {
    console.log('🌐 Starting React development server...');
    
    return new Promise((resolve, reject) => {
      const reactProcess = spawn('npm', ['run', 'dev'], {
        cwd: reactAppPath,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      this.processes.push(reactProcess);

      let serverStarted = false;

      reactProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[React] ${output.trim()}`);
        
        // Check if server is ready
        if (output.includes('Local:') && output.includes('5173') && !serverStarted) {
          serverStarted = true;
          console.log('✅ React server started on http://localhost:5173\n');
          resolve();
        }
      });

      reactProcess.stderr.on('data', (data) => {
        console.error(`[React Error] ${data.toString().trim()}`);
      });

      reactProcess.on('error', (error) => {
        console.error('❌ Failed to start React server:', error);
        reject(error);
      });

      reactProcess.on('exit', (code) => {
        if (code !== 0 && !this.isShuttingDown) {
          console.error(`❌ React server exited with code ${code}`);
          reject(new Error(`React server failed with code ${code}`));
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!serverStarted) {
          reject(new Error('React server failed to start within 30 seconds'));
        }
      }, 30000);
    });
  }

  async buildElectron() {
    console.log('🔨 Building Electron scripts...');
    
    try {
      await this.runCommand('npm run build:electron', { cwd: projectRoot });
      console.log('✅ Electron scripts built\n');
    } catch (error) {
      console.error('❌ Failed to build Electron scripts:', error);
      throw error;
    }
  }

  async startElectron() {
    console.log('⚡ Starting Electron...');
    
    return new Promise((resolve, reject) => {
      const electronProcess = spawn('npx', ['electron', '.', '--enable-logging'], {
        cwd: projectRoot,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        env: {
          ...process.env,
          NODE_ENV: 'development'
        }
      });

      this.processes.push(electronProcess);

      electronProcess.stdout.on('data', (data) => {
        console.log(`[Electron] ${data.toString().trim()}`);
      });

      electronProcess.stderr.on('data', (data) => {
        const output = data.toString().trim();
        // Filter out common Electron warnings
        if (!output.includes('ExtensionLoadWarning') && 
            !output.includes('ContextMenus') &&
            !output.includes('chrome-extension://')) {
          console.error(`[Electron] ${output}`);
        }
      });

      electronProcess.on('error', (error) => {
        console.error('❌ Failed to start Electron:', error);
        reject(error);
      });

      electronProcess.on('exit', (code) => {
        if (!this.isShuttingDown) {
          console.log(`\n⚡ Electron exited with code ${code}`);
          this.shutdown();
        }
      });

      console.log('✅ Electron started successfully\n');
      console.log('🎉 Development environment is ready!');
      console.log('📝 You can now edit files and see changes in real-time.');
      console.log('🔧 Press Ctrl+C to stop the development server.\n');
      
      resolve();
    });
  }

  runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          if (stdout) console.log(stdout.trim());
          if (stderr) console.error(stderr.trim());
          resolve();
        }
      });
    });
  }

  shutdown() {
    if (this.isShuttingDown) return;
    
    this.isShuttingDown = true;
    console.log('\n🛑 Shutting down development environment...');
    
    this.processes.forEach((process, index) => {
      if (process && !process.killed) {
        console.log(`🔄 Terminating process ${index + 1}...`);
        process.kill('SIGTERM');
        
        // Force kill after 5 seconds
        setTimeout(() => {
          if (!process.killed) {
            process.kill('SIGKILL');
          }
        }, 5000);
      }
    });
    
    setTimeout(() => {
      console.log('✅ Development environment stopped');
      process.exit(0);
    }, 1000);
  }
}

// Start the development server
const devServer = new DevServer();
devServer.start().catch((error) => {
  console.error('❌ Development server failed:', error);
  process.exit(1);
});
