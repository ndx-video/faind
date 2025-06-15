@echo off
echo Starting fAInd Electron App...
cd /d "%~dp0"
echo Current directory: %CD%
echo Building Electron app...
call npm run build:electron
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo Launching Electron...
call npx electron .
if %ERRORLEVEL% NEQ 0 (
    echo Electron launch failed!
    pause
    exit /b 1
)
pause
