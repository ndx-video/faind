# PowerShell script to start fAInder development environment
# This script solves the path resolution issues by using absolute paths

Write-Host "🚀 Starting fAInder Development Environment" -ForegroundColor Green
Write-Host ""

# Get absolute paths
$projectRoot = "D:\_PROJECTS\NDX\CODE\faind"
$electronApp = "$projectRoot\electron-app"
$reactApp = "$projectRoot\polymet-fainder"
$mainScript = "$electronApp\simple-main.js"

Write-Host "📁 Project paths:" -ForegroundColor Yellow
Write-Host "  Project root: $projectRoot"
Write-Host "  Electron app: $electronApp"
Write-Host "  React app: $reactApp"
Write-Host "  Main script: $mainScript"
Write-Host ""

# Check if React dev server is running
Write-Host "🌐 Checking React dev server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ React dev server is running on localhost:5173" -ForegroundColor Green
} catch {
    Write-Host "❌ React dev server not running. Starting it now..." -ForegroundColor Red
    Write-Host "📝 Starting React dev server in background..." -ForegroundColor Yellow
    
    # Start React dev server in background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$reactApp'; npx vite" -WindowStyle Minimized
    
    Write-Host "⏳ Waiting for React dev server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Check again
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ React dev server started successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start React dev server. Please start it manually:" -ForegroundColor Red
        Write-Host "   cd $reactApp" -ForegroundColor White
        Write-Host "   npx vite" -ForegroundColor White
        Write-Host ""
        Write-Host "Press any key to continue anyway..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

Write-Host ""
Write-Host "⚡ Starting Electron app..." -ForegroundColor Yellow

# Set environment and start Electron with absolute path
$env:NODE_ENV = "development"
Set-Location $electronApp

Write-Host "🔧 Running command:" -ForegroundColor Cyan
Write-Host "   npx electron `"$mainScript`" --enable-logging" -ForegroundColor White
Write-Host ""

# Start Electron
npx electron "$mainScript" --enable-logging

Write-Host ""
Write-Host "👋 fAInder development session ended" -ForegroundColor Green
