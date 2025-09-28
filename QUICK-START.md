# Quick Start Scripts

## Starting PlagExit

**Double-click `start-plagexit.bat`** to start both backend and frontend automatically.

The script will:
1. Check if Python and Node.js are installed
2. Start Flask backend server on port 5000
3. Start React frontend on port 3000  
4. Open the application in your default browser

## Stopping PlagExit

**Double-click `stop-plagexit.bat`** to stop all services.

## Requirements

- Python 3.10+ installed and in PATH
- Node.js 16+ installed and in PATH  
- MongoDB Atlas connection string configured in `flask-server/.env`

## First Time Setup

1. Copy `env.example` to `flask-server/.env`
2. Add your MongoDB Atlas connection string
3. Double-click `start-plagexit.bat`

That's it! The application will be running at http://localhost:3000