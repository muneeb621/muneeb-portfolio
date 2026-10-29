@echo off
title MUNEEB.DEV - Portfolio Server
cd /d "%~dp0"

echo.
echo  Starting MUNEEB.DEV portfolio...
echo  Open this address in your browser: http://127.0.0.1:8090
echo  Close this window to stop the server.
echo.

where python >nul 2>nul
if %errorlevel%==0 (
    start "" http://127.0.0.1:8090
    python -m http.server 8090
    goto :end
)

where py >nul 2>nul
if %errorlevel%==0 (
    start "" http://127.0.0.1:8090
    py -m http.server 8090
    goto :end
)

where node >nul 2>nul
if %errorlevel%==0 (
    start "" http://127.0.0.1:8090
    npx --yes http-server -p 8090 -c-1
    goto :end
)

echo  ERROR: Python or Node.js not found.
echo  Install Python from https://www.python.org/downloads/
echo  (tick "Add Python to PATH" during install), then run this file again.
pause

:end
