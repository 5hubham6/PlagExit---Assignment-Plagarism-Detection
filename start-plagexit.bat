@echo off
title PlagExit - Starting Application...
color 0A

echo.
echo ========================================
echo    PlagExit - Plagiarism Detection    
echo ========================================
echo.
echo Starting application services...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

echo [1/4] Checking dependencies...
timeout /t 2 /nobreak >nul

REM Start Flask backend in new window
echo [2/4] Starting Flask backend server...
start "PlagExit Backend" cmd /k "cd flask-server && python app.py"
timeout /t 3 /nobreak >nul

REM Install frontend dependencies if needed and start React
echo [3/4] Starting React frontend...
start "PlagExit Frontend" cmd /k "cd client && npm install && npm start"

echo [4/4] Opening application in browser...
timeout /t 8 /nobreak >nul

REM Open the application in default browser
start http://localhost:3000

echo.
echo ========================================
echo   Application Started Successfully!   
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend:    http://localhost:3000
echo.
echo Press any key to close this window...
echo (The application will continue running)
pause >nul