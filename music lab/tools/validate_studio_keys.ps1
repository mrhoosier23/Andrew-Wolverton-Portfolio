param(
  [string]$PortfolioRoot = ""
)

$ErrorActionPreference = "Stop"

if (-not $PortfolioRoot) {
  $toolDir = Split-Path -Parent $MyInvocation.MyCommand.Path
  $PortfolioRoot = [IO.Path]::GetFullPath((Join-Path $toolDir "..\.."))
}
$PortfolioRoot = [IO.Path]::GetFullPath($PortfolioRoot)

$failures = New-Object System.Collections.Generic.List[string]
$passes = New-Object System.Collections.Generic.List[string]

function Test-RequiredFile([string]$RelativePath) {
  $full = Join-Path $PortfolioRoot ($RelativePath.Replace('/', '\'))
  if (Test-Path -LiteralPath $full -PathType Leaf) {
    $passes.Add("PASS  $RelativePath")
    return $true
  }
  $failures.Add("FAIL  Missing file: $RelativePath")
  return $false
}

$required = @(
  "index.html",
  "styles.css",
  "script.js",
  "studio-keys/studio-keys.html",
  "studio-keys/studio.css",
  "studio-keys/studio.js",
  "audio/manifest.json",
  "assets/characters/flannel-idle.webp",
  "assets/characters/flannel-listening.webp",
  "assets/characters/flannel-count.webp",
  "assets/characters/flannel-celebrate.webp",
  "assets/characters/doon-idle.gif",
  "assets/characters/doon-bounce.gif",
  "assets/characters/doon-jump.gif"
)

foreach ($path in $required) { [void](Test-RequiredFile $path) }

$manifestPath = Join-Path $PortfolioRoot "audio\manifest.json"
if (Test-Path -LiteralPath $manifestPath -PathType Leaf) {
  try {
    $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    if (-not $manifest.packs -or $manifest.packs.Count -ne 3) {
      $failures.Add("FAIL  Manifest should contain exactly 3 packs.")
    } else {
      $passes.Add("PASS  Manifest contains 3 packs.")
    }

    $expectedIds = @("02-110-A", "05-099-Bb", "14-115-E")
    foreach ($id in $expectedIds) {
      if ($manifest.packs.id -contains $id) {
        $passes.Add("PASS  Manifest contains pack $id.")
      } else {
        $failures.Add("FAIL  Manifest is missing pack $id.")
      }
    }

    $pathCount = 0
    foreach ($pack in $manifest.packs) {
      foreach ($sectionProperty in $pack.tracks.PSObject.Properties) {
        foreach ($track in $sectionProperty.Value) {
          $pathCount += 1
          $trackPath = [string]$track.path
          $fullTrackPath = Join-Path $PortfolioRoot ($trackPath.Replace('/', '\'))
          if (-not (Test-Path -LiteralPath $fullTrackPath -PathType Leaf)) {
            $failures.Add("FAIL  Manifest path does not exist: $trackPath")
          }
        }
      }
      if ($pack.previewMix) {
        $previewPath = [string]$pack.previewMix
        $fullPreviewPath = Join-Path $PortfolioRoot ($previewPath.Replace('/', '\'))
        if (-not (Test-Path -LiteralPath $fullPreviewPath -PathType Leaf)) {
          $failures.Add("FAIL  Preview mix does not exist: $previewPath")
        }
      }
    }
    if ($pathCount -gt 0) {
      $passes.Add("PASS  Checked $pathCount manifest track paths.")
    } else {
      $failures.Add("FAIL  Manifest contains no track paths.")
    }
  } catch {
    $failures.Add("FAIL  Manifest could not be read: $($_.Exception.Message)")
  }
}

Write-Host ""
Write-Host "Andrew's Studio Keys validation"
Write-Host "Portfolio root: $PortfolioRoot"
Write-Host ""
foreach ($line in $passes) { Write-Host $line -ForegroundColor Green }
foreach ($line in $failures) { Write-Host $line -ForegroundColor Red }
Write-Host ""

if ($failures.Count -gt 0) {
  Write-Host "$($failures.Count) validation failure(s)." -ForegroundColor Red
  exit 1
}

Write-Host "All file and manifest checks passed." -ForegroundColor Green
exit 0
