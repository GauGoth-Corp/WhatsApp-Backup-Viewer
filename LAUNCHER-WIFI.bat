@echo off
cd "%~dp0W-Backup-Viewer"

setlocal enabledelayedexpansion

rem Appelle PowerShell et capture la première IPv4 utile
for /f "usebackq delims=" %%I in (`
  powershell -NoProfile -Command ^
    "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch '^169\.254' -and $_.IPAddress -ne '127.0.0.1' } | Select-Object -First 1 -ExpandProperty IPAddress)"
`) do set "IP=%%I"

echo Starting server on: %IP%...
echo.
endlocal & set "IP=%IP%" 2>nul


start http://%IP%:8000
php -S 0.0.0.0:8000


pause
