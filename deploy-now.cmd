@echo off
chcp 65001 >nul
cd /d C:\Users\30128\Documents\hakka-lantern-h5\react-app\gh-pages-temp

echo ========================================
echo 初始化 Git 仓库
echo ========================================

"C:\Program Files\Git\bin\git.exe" init
"C:\Program Files\Git\bin\git.exe" config user.name "xsandy0506-art"
"C:\Program Files\Git\bin\git.exe" config user.email "xsandy0506@qq.com"
"C:\Program Files\Git\bin\git.exe" add -A

echo ========================================
echo 提交文件
echo ========================================

"C:\Program Files\Git\bin\git.exe" commit -m "Deploy to GitHub Pages with base path /Sandy-H5/"
"C:\Program Files\Git\bin\git.exe" branch -M gh-pages

echo ========================================
echo 添加远程仓库
echo ========================================

"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/xsandy0506-art/Sandy-H5.git

echo ========================================
echo 推送到 GitHub
echo ========================================

"C:\Program Files\Git\bin\git.exe" push -u origin gh-pages --force

echo.
echo ✅ 部署完成！
echo.
echo 📍 访问地址: https://xsandy0506-art.github.io/Sandy-H5/
echo.
echo ⏱️  如果看到白屏，请等待 1-2 分钟后刷新浏览器
echo.

pause
