@echo off
setlocal enabledelayedexpansion

REM Set directory
cd /d "C:\Users\30128\Documents\hakka-lantern-h5\react-app"

REM Git commands
echo Adding files...
"C:\Program Files\Git\bin\git.exe" add vite.config.js dist/

echo Committing...
"C:\Program Files\Git\bin\git.exe" commit -m "Optimize Vite config and rebuild dist"

echo Pushing...
"C:\Program Files\Git\bin\git.exe" push origin master

echo Done!
pause
