param(
  [int]$Port = 8080,
  [string]$Root = ""
)

$ErrorActionPreference = "Stop"
if (-not $Root) {
  $Root = Split-Path -Parent $MyInvocation.MyCommand.Path
}
$Root = [IO.Path]::GetFullPath($Root)

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".gif" = "image/gif"
  ".webp" = "image/webp"
  ".svg" = "image/svg+xml"
  ".ico" = "image/x-icon"
  ".mp3" = "audio/mpeg"
  ".wav" = "audio/wav"
  ".ogg" = "audio/ogg"
  ".m4a" = "audio/mp4"
  ".mp4" = "video/mp4"
  ".webm" = "video/webm"
  ".pdf" = "application/pdf"
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
  Write-Host "Serving: $Root"
  Write-Host "Portfolio: $prefix"
  Write-Host "Studio Keys: ${prefix}studio-keys/studio-keys.html"
  Write-Host "Press Ctrl+C to stop."
  Start-Process $prefix

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    try {
      $requestPath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
      if (-not $requestPath) { $requestPath = "index.html" }
      $candidate = [IO.Path]::GetFullPath((Join-Path $Root ($requestPath.Replace('/', '\'))))

      if (-not $candidate.StartsWith($Root, [StringComparison]::OrdinalIgnoreCase)) {
        $context.Response.StatusCode = 403
        $context.Response.Close()
        continue
      }
      if (Test-Path $candidate -PathType Container) {
        $candidate = Join-Path $candidate "index.html"
      }
      if (-not (Test-Path $candidate -PathType Leaf)) {
        $context.Response.StatusCode = 404
        $body = [Text.Encoding]::UTF8.GetBytes("Not found")
        $context.Response.OutputStream.Write($body, 0, $body.Length)
        $context.Response.Close()
        continue
      }

      $extension = [IO.Path]::GetExtension($candidate).ToLowerInvariant()
      $contentType = $mimeTypes[$extension]
      if (-not $contentType) { $contentType = "application/octet-stream" }
      $bytes = [IO.File]::ReadAllBytes($candidate)
      $context.Response.StatusCode = 200
      $context.Response.ContentType = $contentType
      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.Headers["Cache-Control"] = "no-store"
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      $context.Response.Close()
    } catch {
      try {
        $context.Response.StatusCode = 500
        $context.Response.Close()
      } catch {}
      Write-Warning $_.Exception.Message
    }
  }
} finally {
  if ($listener.IsListening) { $listener.Stop() }
  $listener.Close()
}
