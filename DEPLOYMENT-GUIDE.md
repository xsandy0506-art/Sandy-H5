# 部署指南

## 当前配置

- **vite.config.js**: `base: process.env.VITE_BASE_URL || '/'`
  - 默认 `/` (用于 Vercel/Netlify)
  - 可通过环境变量 `VITE_BASE_URL` 覆盖

## 部署到不同平台

### 1️⃣ Vercel (推荐)
```bash
git add .
git commit -m "Fix: support multiple deployment bases"
git push origin master
```

然后在 Vercel 中：
- 连接到 GitHub 仓库 `Sandy-H5`
- 分支: `master`
- 构建命令: `npm run build` (默认)
- 输出目录: `dist`
- **无需设置环境变量** (使用默认 base: /)

### 2️⃣ GitHub Pages
如需 GitHub Pages 部署（子路径 `/Sandy-H5/`），执行：
```bash
VITE_BASE_URL=/Sandy-H5/ npm run build
```
然后推送 dist 到 gh-pages 分支

### 3️⃣ Netlify
- 分支: `master`
- 构建命令: `npm run build`
- 输出目录: `dist`
- **无需设置环境变量**

## 资源加载问题排查

✅ **已配置**: 所有资源路径相对于基路径
- 图片: `/scheme-plan.jpg` → 自动转换为 `{base}/scheme-plan.jpg`
- 视频: `/panorama.mp4` → 自动转换为 `{base}/panorama.mp4`

❓ 如果仍显示 404:
1. 清空浏览器缓存
2. 检查浏览器控制台错误
3. 验证 dist/ 文件夹包含所有资源

## 当前状态
- [x] vite.config.js 支持多平台
- [x] vercel.json 配置正确
- [x] netlify.toml 配置正确
- [x] 所有资源文件在 public/ 和 dist/
- ⏳ 等待 Vercel 自动部署
