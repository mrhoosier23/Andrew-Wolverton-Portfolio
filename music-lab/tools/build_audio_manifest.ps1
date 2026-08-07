param(
  [string]$PortfolioRoot = ""
)

$ErrorActionPreference = "Stop"

function Get-CompactText([string]$Value) {
  return ([regex]::Replace($Value.ToLowerInvariant(), "[^a-z0-9]+", ""))
}

function Get-CleanInstrumentName([string]$Value) {
  $clean = [regex]::Replace($Value, "[\s_-]+", " ").Trim()
  $lower = $clean.ToLowerInvariant()
  $replacements = @{
    "acoustic guitar" = "Acoustic Guitar"
    "banjo" = "Banjo"
    "bass" = "Bass"
    "djembe btm" = "Djembe Bottom"
    "djembe bottom" = "Djembe Bottom"
    "djembe top" = "Djembe Top"
    "mando" = "Mandolin"
    "mandolin" = "Mandolin"
    "shaker" = "Shaker"
  }
  if ($replacements.ContainsKey($lower)) {
    return $replacements[$lower]
  }
  if ($lower -match '^fiddle\s*(\d*)$') {
    if ($Matches[1]) { return "Fiddle$($Matches[1])" }
    return "Fiddle"
  }
  return (Get-Culture).TextInfo.ToTitleCase($lower)
}

function Get-InstrumentFamily([string]$Name) {
  $lower = $Name.ToLowerInvariant()
  if ($lower.StartsWith("acoustic guitar") -or $lower.StartsWith("guitar")) { return "guitar" }
  if ($lower.StartsWith("banjo")) { return "banjo" }
  if ($lower.StartsWith("bass")) { return "bass" }
  if ($lower.StartsWith("djembe")) { return "djembe" }
  if ($lower.StartsWith("fiddle")) { return "fiddle" }
  if ($lower.StartsWith("mando") -or $lower.StartsWith("mandolin")) { return "mandolin" }
  if ($lower.StartsWith("shaker")) { return "shaker" }
  return $null
}

function Get-SectionParse([string]$TrackName) {
  $patterns = @(
    @{ Pattern = '(?i)(?:intro[\s_-]*fill|introfill)$'; Id = 'intro-fill' },
    @{ Pattern = '(?i)chorus[\s_-]*1$'; Id = 'chorus-1' },
    @{ Pattern = '(?i)verse[\s_-]*1$'; Id = 'verse-1' },
    @{ Pattern = '(?i)verse[\s_-]*2$'; Id = 'verse-2' },
    @{ Pattern = '(?i)verse[\s_-]*3$'; Id = 'verse-3' },
    @{ Pattern = '(?i)chorus$'; Id = 'chorus' },
    @{ Pattern = '(?i)bridge$'; Id = 'bridge' },
    @{ Pattern = '(?i)intro$'; Id = 'intro' },
    @{ Pattern = '(?i)outro$'; Id = 'outro' }
  )
  foreach ($entry in $patterns) {
    $match = [regex]::Match($TrackName, $entry.Pattern)
    if ($match.Success) {
      $instrument = $TrackName.Substring(0, $match.Index).Trim(' ', '_', '-')
      if ($instrument) {
        return [pscustomobject]@{ Instrument = $instrument; Section = $entry.Id }
      }
    }
  }
  return $null
}

if (-not $PortfolioRoot) {
  $toolDir = Split-Path -Parent $MyInvocation.MyCommand.Path
  $candidateA = [IO.Path]::GetFullPath((Join-Path $toolDir "..\.."))
  $candidateB = [IO.Path]::GetFullPath((Join-Path $toolDir ".."))
  if (Test-Path (Join-Path $candidateA "audio\packs")) {
    $PortfolioRoot = $candidateA
  } elseif (Test-Path (Join-Path $candidateB "audio\packs")) {
    $PortfolioRoot = $candidateB
  } else {
    throw "Could not find audio\packs. Place this script in portfolio\studio-keys\tools or pass -PortfolioRoot."
  }
}

$PortfolioRoot = [IO.Path]::GetFullPath($PortfolioRoot)
$PacksRoot = Join-Path $PortfolioRoot "audio\packs"
$ManifestPath = Join-Path $PortfolioRoot "audio\manifest.json"

$packConfigs = @(
  [pscustomobject]@{ Id = "02-110-A"; Folder = "02-110-A"; SourceFolder = "02 110 A"; Title = "Medium Drive"; Key = "A"; Bpm = 110; TimeSignature = "4/4" },
  [pscustomobject]@{ Id = "05-099-Bb"; Folder = "05-099-Bb"; SourceFolder = "05 099 Bb"; Title = "Slow Pocket"; Key = "Bb"; Bpm = 99; TimeSignature = "4/4" },
  [pscustomobject]@{ Id = "14-115-E"; Folder = "14-115-E"; SourceFolder = "14 115 E"; Title = "Bright Run"; Key = "E"; Bpm = 115; TimeSignature = "4/4" }
)

$extensionPriority = @{
  ".wav" = 0
  ".aif" = 1
  ".aiff" = 1
  ".flac" = 2
  ".ogg" = 3
  ".mp3" = 4
  ".m4a" = 5
  ".aac" = 6
}
$sectionOrder = @("intro", "intro-fill", "verse-1", "verse-2", "verse-3", "chorus", "chorus-1", "bridge", "outro")
$packs = @()

Write-Host "Andrew's Studio Keys manifest builder"
Write-Host "Scanning: $PacksRoot"
Write-Host ""

foreach ($config in $packConfigs) {
  $folder = Join-Path $PacksRoot $config.Folder
  if (-not (Test-Path $folder)) {
    Write-Warning "Missing folder: $folder"
    continue
  }

  $selected = @{}
  $preview = $null
  $skipped = New-Object System.Collections.Generic.List[string]

  foreach ($file in Get-ChildItem -LiteralPath $folder -File | Sort-Object Name) {
    $extension = $file.Extension.ToLowerInvariant()
    if (-not $extensionPriority.ContainsKey($extension)) { continue }

    $stem = [IO.Path]::GetFileNameWithoutExtension($file.Name)
    $compactStem = Get-CompactText $stem
    $validFullMixNames = @(
      (Get-CompactText $config.SourceFolder),
      (Get-CompactText $config.Id),
      (Get-CompactText $config.Folder)
    )
    if ($validFullMixNames -contains $compactStem) {
      if (-not $preview -or $extensionPriority[$extension] -lt $extensionPriority[$preview.Extension.ToLowerInvariant()]) {
        $preview = $file
      }
      continue
    }

    $number = $config.Id.Split('-')[0]
    $trackName = [regex]::Replace($stem, "(?i)^$([regex]::Escape($number))[\s_-]*", "").Trim()
    $parsed = Get-SectionParse $trackName
    if (-not $parsed) {
      $skipped.Add($file.Name)
      continue
    }

    $family = Get-InstrumentFamily $parsed.Instrument
    if (-not $family) {
      $skipped.Add($file.Name)
      continue
    }

    $instrument = Get-CleanInstrumentName $parsed.Instrument
    $duplicateKey = "$($parsed.Section)|$(Get-CompactText $instrument)"
    $entry = [pscustomobject]@{
      Family = $family
      Instrument = $instrument
      Section = $parsed.Section
      File = $file
      Priority = $extensionPriority[$extension]
    }

    if (-not $selected.ContainsKey($duplicateKey) -or $entry.Priority -lt $selected[$duplicateKey].Priority) {
      $selected[$duplicateKey] = $entry
    }
  }

  $tracksBySection = @{}
  foreach ($entry in $selected.Values) {
    $relative = $entry.File.FullName.Substring($PortfolioRoot.Length).TrimStart([char[]]'\/').Replace('\', '/')
    if (-not $tracksBySection.ContainsKey($entry.Section)) {
      $tracksBySection[$entry.Section] = New-Object System.Collections.Generic.List[object]
    }
    $tracksBySection[$entry.Section].Add([ordered]@{
      family = $entry.Family
      instrument = $entry.Instrument
      path = $relative
    })
  }

  $sections = New-Object System.Collections.Generic.List[string]
  foreach ($section in $sectionOrder) {
    if ($tracksBySection.ContainsKey($section)) { $sections.Add($section) }
  }
  foreach ($section in ($tracksBySection.Keys | Sort-Object)) {
    if (-not $sections.Contains($section)) { $sections.Add($section) }
  }

  $orderedTracks = [ordered]@{}
  foreach ($section in $sections) {
    $orderedTracks[$section] = @($tracksBySection[$section] | Sort-Object family, instrument, path)
  }

  $previewPath = $null
  if ($preview) {
    $previewPath = $preview.FullName.Substring($PortfolioRoot.Length).TrimStart([char[]]'\/').Replace('\', '/')
  }

  $count = 0
  foreach ($section in $sections) { $count += $orderedTracks[$section].Count }
  Write-Host "$($config.Id): $($sections.Count) sections, $count selected tracks"
  if ($skipped.Count -gt 0) {
    Write-Host "  Skipped $($skipped.Count) unrecognized or duplicate-extension audio files"
  }

  $packs += [ordered]@{
    id = $config.Id
    sourceFolder = $config.SourceFolder
    title = $config.Title
    key = $config.Key
    bpm = $config.Bpm
    timeSignature = $config.TimeSignature
    sections = @($sections)
    previewMix = $previewPath
    tracks = $orderedTracks
  }
}

if ($packs.Count -eq 0) {
  throw "No usable audio packs were found."
}

$manifest = [ordered]@{
  version = 1
  generated = $true
  packs = $packs
}

$manifestDirectory = Split-Path -Parent $ManifestPath
if (-not (Test-Path $manifestDirectory)) {
  New-Item -ItemType Directory -Path $manifestDirectory | Out-Null
}
$manifest | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $ManifestPath -Encoding UTF8
Write-Host ""
Write-Host "Manifest created successfully:"
Write-Host $ManifestPath
