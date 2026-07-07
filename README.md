# Sandy H5 React 源码仓库

这个仓库现在已经恢复为标准的 React + Vite 结构：

- index.html 作为 Vite 入口页
- src/App.jsx 作为主应用源码
- src/main.jsx 作为应用挂载入口
- src/styles.css 作为应用样式源码
- public/ 存放图片、视频、音频等静态资源
- dist/ 作为构建产物目录

发布约定：

1. Vercel 通过 npm run build 发布 dist/。
2. Cloudflare Workers 通过 wrangler.jsonc 指向 dist/。
3. 大媒体文件通过 Git LFS 管理。
4. 推送前先运行 scripts/verify-deploy.ps1。

快速检查：

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\scripts\verify-deploy.ps1
```
