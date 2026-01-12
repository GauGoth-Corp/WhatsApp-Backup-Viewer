@echo off
cd "%~dp0W-Backup-Viewer"
start http://localhost:8000
php -S localhost:8000

pause
