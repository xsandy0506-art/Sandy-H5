@echo off
setlocal enabledelayedexpansion

echo ========================================
echo 部署到 Netlify
echo ========================================
echo.

REM 检查是否安装了 netlify-cli
where netlify >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 正在安装 netlify-cli...
    call npm install -g netlify-cli
)

echo.
echo 执行 Netlify 部署...
echo.

REM 进入dist目录
cd /d C:\Users\30128\Documents\hakka-lantern-h5\react-app\dist

REM 部署到Netlify
netlify deploy --prod --dir . --site sandy-h5

echo.
echo ✅ 部署完成！
echo.
echo 📍 访问地址: https://sandy-h5.netlify.app/
echo.

pause
