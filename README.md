# Sandy H5 发布仓库说明

这个仓库当前采用“静态发布仓库”模式。

唯一会被线上平台直接发布的内容是仓库根目录下这些文件和目录：

- index.html
- assets/
- 根目录下的图片、视频、音频文件
- .gitattributes
- wrangler.jsonc

下面这些目录只属于本地工作区，不参与线上发布，已经被忽略：

- node_modules/
- gh-pages-temp/
- public/
- dist/

发布原则：

1. 线上内容必须直接存在于仓库根目录。
2. 大媒体文件必须通过 Git LFS 跟踪。
3. 推送前先运行 scripts/verify-deploy.ps1。

快速检查：

```powershell
pwsh .\scripts\verify-deploy.ps1
```

如果脚本返回成功，再执行推送。
