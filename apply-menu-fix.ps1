$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$pages = @('index.html', 'projects.html', 'services.html')
foreach ($page in $pages) {
    if (-not (Test-Path -LiteralPath (Join-Path $root $page))) {
        throw "Missing $page. Put both fix files in the same folder as index.html, projects.html, and services.html."
    }
}

$logoPath = Join-Path $root 'assets\Home Logo.png'
if (-not (Test-Path -LiteralPath $logoPath)) {
    throw "Missing assets\Home Logo.png. Keep your existing Home Logo.png in the assets folder, then run this again."
}

$cssPath = Join-Path $root 'styles.css'
if (-not (Test-Path -LiteralPath $cssPath)) {
    $alternateCss = Join-Path $root 'styles\batch-3-refinements.css'
    if (Test-Path -LiteralPath $alternateCss) {
        $cssPath = $alternateCss
    }
    else {
        throw "Could not find styles.css or styles\batch-3-refinements.css."
    }
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupPath = Join-Path $root "_menu_backup_$stamp"
New-Item -ItemType Directory -Path $backupPath | Out-Null

foreach ($page in $pages) {
    Copy-Item -LiteralPath (Join-Path $root $page) -Destination $backupPath
}
Copy-Item -LiteralPath $cssPath -Destination $backupPath

$headers = @{}

$headers['index.html'] = @'
<header class="site-header centered-nav-header" id="siteHeader">
  <div class="centered-nav-inner">
    <nav class="centered-nav" id="siteNav" aria-label="Primary navigation">
      <a class="centered-nav-link centered-nav-projects" href="projects.html" data-page-link="projects">Projects</a>
      <a class="centered-home-link active" href="index.html" data-page-link="home" aria-current="page" aria-label="Home">
        <span class="centered-home-logo" aria-hidden="true">
          <img src="assets/Home Logo.png" alt="">
        </span>
        <span class="centered-home-label">Home</span>
      </a>
      <a class="centered-nav-link centered-nav-services" href="services.html" data-page-link="services">Services</a>
    </nav>
  </div>
</header>
'@

$headers['projects.html'] = @'
<header class="site-header centered-nav-header" id="siteHeader">
  <div class="centered-nav-inner">
    <nav class="centered-nav" id="siteNav" aria-label="Primary navigation">
      <a class="centered-nav-link centered-nav-projects active" href="projects.html" data-page-link="projects" aria-current="page">Projects</a>
      <a class="centered-home-link" href="index.html" data-page-link="home" aria-label="Home">
        <span class="centered-home-logo" aria-hidden="true">
          <img src="assets/Home Logo.png" alt="">
        </span>
        <span class="centered-home-label">Home</span>
      </a>
      <a class="centered-nav-link centered-nav-services" href="services.html" data-page-link="services">Services</a>
    </nav>
  </div>
</header>
'@

$headers['services.html'] = @'
<header class="site-header centered-nav-header" id="siteHeader">
  <div class="centered-nav-inner">
    <nav class="centered-nav" id="siteNav" aria-label="Primary navigation">
      <a class="centered-nav-link centered-nav-projects" href="projects.html" data-page-link="projects">Projects</a>
      <a class="centered-home-link" href="index.html" data-page-link="home" aria-label="Home">
        <span class="centered-home-logo" aria-hidden="true">
          <img src="assets/Home Logo.png" alt="">
        </span>
        <span class="centered-home-label">Home</span>
      </a>
      <a class="centered-nav-link centered-nav-services active" href="services.html" data-page-link="services" aria-current="page">Services</a>
    </nav>
  </div>
</header>
'@

$headerPattern = '(?is)<header\b[^>]*\bid=["'']siteHeader["''][^>]*>.*?</header>'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($page in $pages) {
    $pagePath = Join-Path $root $page
    $text = [System.IO.File]::ReadAllText($pagePath)
    $regex = New-Object System.Text.RegularExpressions.Regex($headerPattern)
    if (-not $regex.IsMatch($text)) {
        throw "Could not find the existing siteHeader block in $page. Your backup is in $backupPath."
    }
    $updated = $regex.Replace($text, $headers[$page], 1)
    [System.IO.File]::WriteAllText($pagePath, $updated, $utf8NoBom)
}

$menuCss = @'
/* === CENTERED HOME LOGO MENU: START === */

.site-header.centered-nav-header {
  position: fixed !important;
  z-index: 2400 !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 104px !important;
  padding: 0 !important;
  transform: none !important;
  color: var(--ink) !important;
  background: rgba(255, 253, 248, 0.985) !important;
  border: 0 !important;
  box-shadow: 0 7px 22px rgba(7, 27, 23, 0.055) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.centered-nav-inner {
  width: min(calc(100% - 16px), 360px);
  height: 104px;
  margin: 0 auto;
}

.centered-nav {
  position: relative;
  width: 100%;
  height: 104px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 94px minmax(0, 1fr);
  align-items: start;
}

.centered-nav::before {
  content: "";
  position: absolute;
  z-index: 0;
  left: 0;
  right: 0;
  top: 70px;
  height: 1px;
  background: rgba(23, 63, 53, 0.14);
}

.centered-nav-link,
.centered-home-link {
  position: relative;
  z-index: 2;
  color: #676567;
  font-family: var(--font-display);
  font-weight: 600;
  text-decoration: none;
  transition: color 150ms ease, transform 150ms ease;
}

.centered-nav-link {
  margin-top: 14px;
  padding: 10px 10px 30px;
  font-size: 1.17rem;
  line-height: 1;
  letter-spacing: 0.015em;
}

.centered-nav-projects {
  grid-column: 1;
  justify-self: end;
}

.centered-nav-services {
  grid-column: 3;
  justify-self: start;
}

.centered-home-link {
  grid-column: 2;
  width: 94px;
  min-height: 102px;
  display: grid;
  grid-template-rows: 72px 30px;
  justify-items: center;
  align-items: start;
  text-align: center;
}

.centered-home-logo {
  position: relative;
  z-index: 2;
  width: 68px;
  height: 68px;
  margin-top: 3px;
  display: grid;
  place-items: center;
  border: 4px solid rgba(255, 253, 248, 0.98);
  border-radius: 50%;
  background: var(--aqua);
  box-shadow:
    0 0 0 1px rgba(46, 157, 145, 0.16),
    0 7px 18px rgba(7, 27, 23, 0.12);
}

.centered-home-logo::before {
  content: "";
  position: absolute;
  inset: -9px;
  border: 3px dotted #17b8bf;
  border-radius: 50%;
  pointer-events: none;
}

.centered-home-logo::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -14px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #17b8bf;
  transform: translateX(-50%);
}

.centered-home-logo img {
  display: block !important;
  width: 46px !important;
  height: 46px !important;
  max-width: none !important;
  object-fit: contain !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.centered-home-label {
  position: relative;
  z-index: 3;
  align-self: end;
  padding-top: 4px;
  color: #159fa7;
  background: rgba(255, 253, 248, 0.985);
  font-size: 1.12rem;
  line-height: 1;
  letter-spacing: 0.01em;
}

.centered-nav-link:hover,
.centered-nav-link:focus-visible,
.centered-home-link:hover .centered-home-label,
.centered-home-link:focus-visible .centered-home-label,
.centered-nav-link.active,
.centered-home-link.active .centered-home-label {
  color: #159fa7;
}

.centered-nav-link:hover,
.centered-nav-link:focus-visible {
  transform: translateY(-1px);
}

.centered-nav-link:focus-visible,
.centered-home-link:focus-visible {
  outline: 3px solid rgba(40, 220, 224, 0.48);
  outline-offset: 3px;
  border-radius: 10px;
}

html {
  scroll-padding-top: 116px !important;
}

main section[id] {
  scroll-margin-top: 116px !important;
}

.page-jump-nav {
  top: 104px !important;
}

@media (max-width: 560px) {
  .site-header.centered-nav-header,
  .centered-nav-inner,
  .centered-nav {
    height: 98px !important;
  }

  .centered-nav-inner {
    width: min(calc(100% - 12px), 330px);
  }

  .centered-nav {
    grid-template-columns: minmax(0, 1fr) 86px minmax(0, 1fr);
  }

  .centered-nav::before {
    top: 66px;
  }

  .centered-nav-link {
    margin-top: 13px;
    padding: 9px 6px 29px;
    font-size: 1.04rem;
  }

  .centered-home-link {
    width: 86px;
    min-height: 96px;
    grid-template-rows: 68px 28px;
  }

  .centered-home-logo {
    width: 62px;
    height: 62px;
  }

  .centered-home-logo::before {
    inset: -8px;
    border-width: 2px;
  }

  .centered-home-logo img {
    width: 42px !important;
    height: 42px !important;
  }

  .centered-home-label {
    font-size: 1.04rem;
  }

  html {
    scroll-padding-top: 108px !important;
  }

  main section[id] {
    scroll-margin-top: 108px !important;
  }

  .page-jump-nav {
    top: 98px !important;
  }
}

@media (max-width: 360px) {
  .centered-nav-link {
    font-size: 0.96rem;
    padding-inline: 3px;
  }
}

/* === CENTERED HOME LOGO MENU: END === */
'@

$css = [System.IO.File]::ReadAllText($cssPath)
$cssPattern = '(?s)/\* === CENTERED HOME LOGO MENU: START === \*/.*?/\* === CENTERED HOME LOGO MENU: END === \*/'
$css = [System.Text.RegularExpressions.Regex]::Replace($css, $cssPattern, '')
$css = $css.TrimEnd() + [Environment]::NewLine + [Environment]::NewLine + $menuCss.Trim() + [Environment]::NewLine
[System.IO.File]::WriteAllText($cssPath, $css, $utf8NoBom)

Write-Host ''
Write-Host 'Centered menu installed successfully.' -ForegroundColor Green
Write-Host 'Updated: index.html, projects.html, services.html, and the active CSS file.'
Write-Host "Backup saved to: $backupPath"
Write-Host 'The menu now uses assets\Home Logo.png with Projects on the left, Services on the right, and Home centered below the logo.'
