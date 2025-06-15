@echo off
echo Starting fAInd Electron App...
cd /d %~dp0
echo Current directory: %CD%

echo.
echo Building TypeScript...
call npm run build:electron
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    echo Check the TypeScript compilation errors above.
    pause
    exit /b 1
)

echo.
echo Build successful! Launching Electron...
call npx electron .
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Electron launch failed!
    echo Check the console output above for details.
    pause
    exit /b 1
)

echo.
echo Electron closed normally.
pause
