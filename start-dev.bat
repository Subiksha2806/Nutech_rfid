@echo off
chcp 65001 >nul
echo ======================================
echo   NUTECH WAREHOUSE SYSTEM - STARTUP
echo ======================================
echo.

:: Check if MongoDB is running
echo Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB is running
) else (
    echo ⚠ MongoDB is not running!
    echo Please start MongoDB first, or install it from:
    echo https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)

echo.
echo Starting Backend Server...
cd backend
start "Nutech Backend" cmd /k "npm install && npm start"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
cd ..\frontend
start "Nutech Frontend" cmd /k "npm install && npm start"

echo.
echo ======================================
echo   SERVERS STARTING...
echo ======================================
echo.
echo Backend will be at: http://localhost:5000
echo Frontend will be at: http://localhost:3000
echo.
echo Wait for both windows to show "Compiled successfully" or "Server running"
echo Then open: http://localhost:3000
echo.
pause
