@echo off
setlocal enabledelayedexpansion

echo 部署到 GitHub Pages...
echo.

REM 检查dist目录
if not exist "dist" (
    echo ❌ dist 目录不存在！
    echo 请先运行: npm run build
    pause
    exit /b 1
)

REM 删除旧的gh-pages分支本地副本
if exist "gh-pages-temp" (
    rmdir /s /q "gh-pages-temp"
)

REM 创建临时目录
mkdir gh-pages-temp
cd gh-pages-temp

REM 初始化git repo
echo 初始化 Git...
"C:\Program Files\Git\bin\git.exe" init
"C:\Program Files\Git\bin\git.exe" config user.name "xsandy0506-art"
"C:\Program Files\Git\bin\git.exe" config user.email "xsandy0506@qq.com"

REM 复制dist文件
echo 复制 dist 文件...
cd ..
xcopy dist gh-pages-temp /e /i /y /q

cd gh-pages-temp

REM 添加.nojekyll文件 (禁用Jekyll处理)
echo. > .nojekyll

REM 提交
echo 提交文件...
"C:\Program Files\Git\bin\git.exe" add -A
"C:\Program Files\Git\bin\git.exe" commit -m "Deploy to GitHub Pages"
"C:\Program Files\Git\bin\git.exe" branch -M gh-pages

REM 推送
echo 推送到 GitHub...
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/xsandy0506-art/Sandy-H5.git
"C:\Program Files\Git\bin\git.exe" push -u origin gh-pages --force

echo.
echo ✅ 部署完成！
echo.
echo 📍 访问地址: https://xsandy0506-art.github.io/Sandy-H5/
echo.
echo 注意：GitHub Pages 首次部署可能需要 1-2 分钟才能生效
pause
