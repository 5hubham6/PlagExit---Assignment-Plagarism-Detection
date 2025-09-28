@echo off
echo ========================================
echo PlagExit - Interview Demo Quick Start
echo ========================================

echo.
echo Starting Backend Server...
cd /d "d:\Projects\Autoassign-main\flask-server"
start "PlagExit Backend" cmd /k "python app.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend Server...
cd /d "d:\Projects\Autoassign-main\client"
start "PlagExit Frontend" cmd /k "npm start"

echo.
echo ========================================
echo Demo servers are starting...
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo Health:   http://localhost:5000/health
echo.
echo Wait for both servers to fully start,
echo then open http://localhost:3000 in your browser
echo ========================================

pause