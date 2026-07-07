#!/usr/bin/env bash
# GitHub Pages deployment script

# 配置
GITHUB_REPO="https://github.com/xsandy0506-art/Sandy-H5.git"
BRANCH="gh-pages"

# 删除旧的dist构建临时目录
rm -rf /tmp/gh-pages-deploy
mkdir -p /tmp/gh-pages-deploy

# 复制dist到临时目录
cp -r dist/* /tmp/gh-pages-deploy/

# 初始化git repo for deployment
cd /tmp/gh-pages-deploy
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git branch -M $BRANCH

# 推送到GitHub
git remote add origin $GITHUB_REPO
git push -u origin $BRANCH --force

echo "✅ Deployed to GitHub Pages!"
echo "📍 Visit: https://xsandy0506-art.github.io/Sandy-H5/"
