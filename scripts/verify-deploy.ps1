$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot

$requiredFiles = @(
  'index.html',
  'assets/index-B0Rql61V.js',
  'assets/index-CQxLml3X.css',
  'background-music.m4a',
  'center-lantern.jpg',
  'day-aerial.jpg',
  'gallery.jpg',
  'night-aerial.jpg',
  'panorama.mp4',
  'panorama-2.mp4',
  'panorama-3.mp4',
  'panorama-4.mp4',
  'panorama-5.mp4',
  'panorama-6.mp4',
  'promenade.jpg',
  'scheme-plan.jpg',
  'waterfront.jpg',
  'welcome-gate.jpg',
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
  'background-music.m4a',
  'center-lantern.jpg',
  'day-aerial.jpg',
  'gallery.jpg',
  'night-aerial.jpg',
  'panorama.mp4',
  'panorama-2.mp4',
  'panorama-3.mp4',
  'panorama-4.mp4',
  'panorama-5.mp4',
  'panorama-6.mp4',
  'promenade.jpg',
  'scheme-plan.jpg',
  'waterfront.jpg',
  'welcome-gate.jpg'
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
