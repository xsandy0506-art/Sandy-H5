$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot

$requiredFiles = @(
  'index.html',
  'package.json',
  'vercel.json',
  'scripts/build.mjs',
  'public/runtime-fixes.js',
  'public/assets/index-B0Rql61V.js',
  'public/assets/index-CQxLml3X.css',
  'public/background-music.m4a',
  'public/center-lantern.jpg',
  'public/day-aerial.jpg',
  'public/gallery.jpg',
  'public/night-aerial.jpg',
  'public/panorama.mp4',
  'public/panorama-2.mp4',
  'public/panorama-3.mp4',
  'public/panorama-4.mp4',
  'public/panorama-5.mp4',
  'public/panorama-6.mp4',
  'public/promenade.jpg',
  'public/scheme-plan.jpg',
  'public/waterfront.jpg',
  'public/welcome-gate.jpg',
  '.gitattributes',
  'wrangler.jsonc'
)

$missing = @()
foreach ($relativePath in $requiredFiles) {
  $fullPath = Join-Path $repoRoot $relativePath
  if (-not (Test-Path $fullPath)) {
    $missing += $relativePath
  }
}

if ($missing.Count -gt 0) {
  Write-Host 'Missing deploy files:' -ForegroundColor Red
  $missing | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
  exit 1
}

$git = 'C:\Program Files\Git\bin\git.exe'
if (-not (Test-Path $git)) {
  Write-Host 'Git not found. File existence check passed; LFS check skipped.' -ForegroundColor Yellow
  exit 0
}

$lfsOutput = & $git -C $repoRoot lfs ls-files
$requiredLfsFiles = @(
  'public/background-music.m4a',
  'public/center-lantern.jpg',
  'public/day-aerial.jpg',
  'public/gallery.jpg',
  'public/night-aerial.jpg',
  'public/panorama.mp4',
  'public/panorama-2.mp4',
  'public/panorama-3.mp4',
  'public/panorama-4.mp4',
  'public/panorama-5.mp4',
  'public/panorama-6.mp4',
  'public/promenade.jpg',
  'public/scheme-plan.jpg',
  'public/waterfront.jpg',
  'public/welcome-gate.jpg'
)

$missingFromLfs = @()
foreach ($fileName in $requiredLfsFiles) {
  if (-not ($lfsOutput -match [regex]::Escape($fileName))) {
    $missingFromLfs += $fileName
  }
}

if ($missingFromLfs.Count -gt 0) {
  Write-Host 'Media files missing from Git LFS:' -ForegroundColor Red
  $missingFromLfs | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
  exit 1
}

Write-Host 'Deploy verification passed: static files and Git LFS media are ready.' -ForegroundColor Green
