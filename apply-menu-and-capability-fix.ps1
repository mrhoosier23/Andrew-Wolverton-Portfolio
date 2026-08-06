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
$backupPath = Join-Path $root "_menu_capability_backup_$stamp"
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
        <span class="centered-home-logo" aria-hidden="true"><img src="assets/Home Logo.png" alt=""></span>
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
        <span class="centered-home-logo" aria-hidden="true"><img src="assets/Home Logo.png" alt=""></span>
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
        <span class="centered-home-logo" aria-hidden="true"><img src="assets/Home Logo.png" alt=""></span>
        <span class="centered-home-label">Home</span>
      </a>
      <a class="centered-nav-link centered-nav-services active" href="services.html" data-page-link="services" aria-current="page">Services</a>
    </nav>
  </div>
</header>
'@

$headerPattern = '(?is)<header\b[^>]*\bid=["'']siteHeader["''][^>]*>.*?</header>'
$headerRegex = New-Object System.Text.RegularExpressions.Regex($headerPattern)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($page in $pages) {
    $pagePath = Join-Path $root $page
    $text = [System.IO.File]::ReadAllText($pagePath)
    if (-not $headerRegex.IsMatch($text)) {
        throw "Could not find the existing siteHeader block in $page. Your backup is in $backupPath."
    }
    $updated = $headerRegex.Replace($text, $headers[$page], 1)
    [System.IO.File]::WriteAllText($pagePath, $updated, $utf8NoBom)
}

$fixCss = @'
/* === CENTERED HOME LOGO MENU: START === */
.site-header.centered-nav-header {
  position: fixed !important;
  z-index: 2400 !important;
  inset: 0 0 auto !important;
  width: 100% !important;
  height: 98px !important;
  padding: 0 !important;
  transform: none !important;
  color: var(--ink) !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.centered-nav-inner {
  width: min(calc(100% - 20px), 360px) !important;
  height: 98px !important;
  margin: 0 auto !important;
  background: transparent !important;
}

.centered-nav {
  position: relative !important;
  width: 100% !important;
  height: 98px !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 84px minmax(0, 1fr) !important;
  align-items: start !important;
  gap: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  transform: none !important;
}

.centered-nav::before {
  content: "";
  position: absolute;
  z-index: 0;
  left: 0;
  right: 0;
  top: 68px;
  height: 1px;
  background: rgba(23, 63, 53, 0.16);
}

.centered-nav-link,
.centered-home-link {
  position: relative;
  z-index: 2;
  color: #676567 !important;
  font-family: var(--font-display) !important;
  font-weight: 600 !important;
  text-decoration: none !important;
}

.centered-nav-link {
  margin-top: 15px !important;
  padding: 10px 10px 29px !important;
  display: block !important;
  min-height: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  font-size: 1.17rem !important;
  line-height: 1 !important;
  letter-spacing: .015em !important;
}

.centered-nav-projects { grid-column: 1; justify-self: end; }
.centered-nav-services { grid-column: 3; justify-self: start; }

.centered-home-link {
  grid-column: 2;
  width: 84px !important;
  min-height: 96px !important;
  display: grid !important;
  grid-template-rows: 70px 26px !important;
  justify-items: center !important;
  align-items: start !important;
  text-align: center !important;
  background: transparent !important;
  border-radius: 0 !important;
}

.centered-home-logo {
  width: 68px !important;
  height: 68px !important;
  margin-top: 1px !important;
  display: grid !important;
  place-items: center !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.centered-home-logo::before,
.centered-home-logo::after {
  content: none !important;
  display: none !important;
}

.centered-home-logo img {
  display: block !important;
  width: 62px !important;
  height: 62px !important;
  max-width: none !important;
  object-fit: contain !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.centered-home-label {
  position: relative;
  z-index: 3;
  align-self: end;
  padding: 3px 5px 0 !important;
  color: #159fa7 !important;
  background: transparent !important;
  font-size: 1.08rem !important;
  line-height: 1 !important;
  letter-spacing: .01em !important;
}

.centered-nav-link:hover,
.centered-nav-link:focus-visible,
.centered-nav-link.active,
.centered-home-link:hover .centered-home-label,
.centered-home-link:focus-visible .centered-home-label,
.centered-home-link.active .centered-home-label {
  color: #159fa7 !important;
  background: transparent !important;
}


.centered-nav-link:focus-visible,
.centered-home-link:focus-visible {
  outline: 3px solid rgba(40, 220, 224, .44) !important;
  outline-offset: 3px !important;
}

html { scroll-padding-top: 108px !important; }
main section[id] { scroll-margin-top: 108px !important; }
.page-jump-nav { top: 98px !important; }

@media (max-width: 560px) {
  .site-header.centered-nav-header,
  .centered-nav-inner,
  .centered-nav { height: 94px !important; }
  .centered-nav-inner { width: min(calc(100% - 12px), 330px) !important; }
  .centered-nav { grid-template-columns: minmax(0, 1fr) 80px minmax(0, 1fr) !important; }
  .centered-nav::before { top: 65px; }
  .centered-nav-link { margin-top: 14px !important; padding: 9px 6px 28px !important; font-size: 1.04rem !important; }
  .centered-home-link { width: 80px !important; min-height: 92px !important; grid-template-rows: 67px 25px !important; }
  .centered-home-logo { width: 64px !important; height: 64px !important; }
  .centered-home-logo img { width: 58px !important; height: 58px !important; }
  .centered-home-label { font-size: 1.02rem !important; }
  html { scroll-padding-top: 104px !important; }
  main section[id] { scroll-margin-top: 104px !important; }
  .page-jump-nav { top: 94px !important; }
}
/* === CENTERED HOME LOGO MENU: END === */

/* === HOME CAPABILITY ACCORDION: START === */
.page-home .home-capabilities {
  background: #f8f4ec !important;
}

.page-home .home-capability-list {
  max-width: var(--max) !important;
  margin: 0 auto !important;
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 14px !important;
  border: 0 !important;
}

.page-home .home-capability-list > details {
  position: relative !important;
  overflow: hidden !important;
  min-width: 0 !important;
  border: 1px solid rgba(23, 63, 53, .16) !important;
  border-radius: 18px !important;
  color: var(--ink) !important;
  background: rgba(255, 253, 248, .94) !important;
  box-shadow: 0 10px 26px rgba(7, 27, 23, .055) !important;
}

.page-home .home-capability-list > details[open] {
  grid-column: 1 / -1 !important;
  border-color: rgba(46, 157, 145, .42) !important;
  background: #fffdf8 !important;
  box-shadow: 0 16px 34px rgba(7, 27, 23, .09) !important;
}

.page-home .home-capability-list > details > summary {
  position: relative !important;
  min-height: 92px !important;
  margin: 0 !important;
  padding: 19px 62px 18px 22px !important;
  display: grid !important;
  align-content: center !important;
  gap: 7px !important;
  list-style: none !important;
  cursor: pointer !important;
  background: transparent !important;
}

.page-home .home-capability-list > details > summary::-webkit-details-marker {
  display: none !important;
}

.page-home .home-capability-list > details > summary::marker {
  content: "" !important;
}

.page-home .home-capability-list > details > summary::after {
  content: "+" !important;
  position: absolute !important;
  top: 50% !important;
  right: 20px !important;
  width: 34px !important;
  height: 34px !important;
  display: grid !important;
  place-items: center !important;
  border: 1px solid rgba(23, 63, 53, .2) !important;
  border-radius: 50% !important;
  color: var(--deep) !important;
  background: rgba(99, 221, 209, .12) !important;
  font-family: var(--font-body) !important;
  font-size: 1.32rem !important;
  font-weight: 500 !important;
  line-height: 1 !important;
  transform: translateY(-50%) !important;
}

.page-home .home-capability-list > details[open] > summary::after {
  content: "−" !important;
  color: #07312a !important;
  background: var(--aqua) !important;
  border-color: var(--aqua) !important;
}

.page-home .home-capability-list > details > summary > span {
  display: block !important;
  color: var(--deep) !important;
  font-family: var(--font-display) !important;
  font-size: clamp(1.45rem, 2vw, 1.8rem) !important;
  font-weight: 800 !important;
  line-height: .98 !important;
}

.page-home .home-capability-list > details > summary > small {
  display: block !important;
  color: #587269 !important;
  font-family: var(--font-body) !important;
  font-size: .89rem !important;
  font-weight: 500 !important;
  line-height: 1.35 !important;
}

.page-home .home-capability-list > details > div {
  margin: 0 22px 20px !important;
  padding: 18px 0 0 !important;
  border-top: 1px solid rgba(23, 63, 53, .12) !important;
  color: var(--ink) !important;
  background: transparent !important;
}

.page-home .home-capability-list > details > div p {
  margin: 0 0 14px !important;
  color: #47635b !important;
  line-height: 1.55 !important;
}

.page-home .home-capability-list > details > div a {
  display: inline-flex !important;
  align-items: center !important;
  min-height: 38px !important;
  padding: 8px 13px !important;
  border: 1px solid rgba(23, 63, 53, .15) !important;
  border-radius: 999px !important;
  color: var(--deep) !important;
  background: rgba(99, 221, 209, .13) !important;
  font-family: var(--font-display) !important;
  font-weight: 800 !important;
  text-decoration: none !important;
}

.page-home .home-capability-list > details > div a:hover,
.page-home .home-capability-list > details > div a:focus-visible {
  background: rgba(99, 221, 209, .28) !important;
}

@media (max-width: 760px) {
  .page-home .home-capability-list {
    grid-template-columns: 1fr !important;
  }
  .page-home .home-capability-list > details[open] {
    grid-column: auto !important;
  }
}

@media (max-width: 480px) {
  .page-home .home-capability-list > details > summary {
    min-height: 86px !important;
    padding: 17px 56px 16px 18px !important;
  }
  .page-home .home-capability-list > details > summary::after {
    right: 16px !important;
    width: 32px !important;
    height: 32px !important;
  }
  .page-home .home-capability-list > details > div {
    margin-inline: 18px !important;
  }
}
/* === HOME CAPABILITY ACCORDION: END === */
'@

$css = [System.IO.File]::ReadAllText($cssPath)
$menuPattern = '(?s)/\* === CENTERED HOME LOGO MENU: START === \*/.*?/\* === CENTERED HOME LOGO MENU: END === \*/'
$capabilityPattern = '(?s)/\* === HOME CAPABILITY ACCORDION: START === \*/.*?/\* === HOME CAPABILITY ACCORDION: END === \*/'
$css = [System.Text.RegularExpressions.Regex]::Replace($css, $menuPattern, '')
$css = [System.Text.RegularExpressions.Regex]::Replace($css, $capabilityPattern, '')
$css = $css.TrimEnd() + [Environment]::NewLine + [Environment]::NewLine + $fixCss.Trim() + [Environment]::NewLine
[System.IO.File]::WriteAllText($cssPath, $css, $utf8NoBom)

Write-Host ''
Write-Host 'Menu and capability design fixed successfully.' -ForegroundColor Green
Write-Host 'Updated: index.html, projects.html, services.html, and the active CSS file.'
Write-Host "Backup saved to: $backupPath"
Write-Host 'The header is transparent, the extra logo circles are removed, and the homepage capability accordions are restored.'
