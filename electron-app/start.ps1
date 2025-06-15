#!/usr/bin/env pwsh

Write-Host "Starting fAInd Electron App..." -ForegroundColor Green
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow

# Build the Electron app
Write-Host "`nBuilding TypeScript..." -ForegroundColor Cyan
& npm run build:electron

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nERROR: Build failed!" -ForegroundColor Red
    Write-Host "Check the TypeScript compilation errors above." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Launch Electron
Write-Host "`nBuild successful! Launching Electron..." -ForegroundColor Green
& npx electron .

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nERROR: Electron launch failed!" -ForegroundColor Red
    Write-Host "Check the console output above for details." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`nElectron closed normally." -ForegroundColor Green
Read-Host "Press Enter to exit"
