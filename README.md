# Sandy H5 仓库说明

这个仓库现在采用“源码仓库 + 构建发布”模式。

当前可持续发布的主线是：

- 根目录的 index.html 作为页面入口模板
- public/ 作为静态资源源目录
- public/assets/ 保存当前生产可用的前端 bundle
- public/ 下的图片、视频、音频通过 Git LFS 管理
- dist/ 作为构建产物目录，不再手工维护

说明：

1. 当前线上 React 逻辑只有生产 bundle，可安全追溯的完整 JSX 源码并不在仓库中。
2. 为了不破坏现有线上效果，仓库先标准化为“可构建的静态源码仓库”。
3. 后续如果找回完整 React 源码，可以再升级成真正的 src/ + public/ Vite 项目。

发布约定：

1. Vercel 通过 npm run build 发布 dist/。
2. Cloudflare Workers 通过 wrangler.jsonc 指向 dist/。
3. 当前 build 不再二次打包 bundle，只把 index.html 和 public/ 稳定复制到 dist/。
4. 推送前先运行 scripts/verify-deploy.ps1。

快速检查：

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\scripts\verify-deploy.ps1
```
