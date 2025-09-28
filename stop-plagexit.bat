@echo off
title PlagExit - Stopping Application...
color 0C

echo.
echo ========================================
echo    PlagExit - Stopping Services      
echo ========================================
echo.

echo Stopping Python processes...
taskkill /F /IM python.exe /T 2>nul
if %errorlevel% equ 0 (
    echo ✓ Flask backend stopped
) else (
    echo ! No Python processes found
)

echo.
echo Stopping Node.js processes...
taskkill /F /IM node.exe /T 2>nul
if %errorlevel% equ 0 (
    echo ✓ React frontend stopped
) else (
    echo ! No Node.js processes found
)

echo.
echo ========================================
echo    All Services Stopped Successfully  
echo ========================================
echo.
pause