@echo off
title Amazona Java Full Stack Launcher
echo ===================================================
echo   Starting Amazona Java Full Stack Application...
echo ===================================================

echo Starting Backend on Port 5000...
start "Spring Boot Backend (Port 5000)" cmd /k "cd /d "%~dp0spring-backend" && mvnw.cmd spring-boot:run"

echo Starting Frontend on Port 3001...
start "React Frontend (Port 3001)" cmd /k "cd /d "%~dp0frontend" && npx serve -s build -l 3001"

timeout /t 5 >nul
echo.
echo ===================================================
echo   Amazona is now running!
echo   - Storefront: http://localhost:3001
echo   - Swagger API: http://localhost:5000/swagger-ui.html
echo ===================================================
start http://localhost:3001
start http://localhost:5000/swagger-ui.html
pause
