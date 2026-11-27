param(
    [Parameter(Mandatory=$true)][string]$VaultPath,
    [string]$ConfigDirectory = '.obsidian'
)
$ErrorActionPreference = 'Stop'
if (Get-Process -Name Obsidian -ErrorAction SilentlyContinue) {
    throw 'Close Obsidian completely before installing.'
}
$repo = Split-Path -Parent $PSScriptRoot
$vault = (Resolve-Path -LiteralPath $VaultPath).Path
$target = Join-Path (Join-Path (Join-Path $vault $ConfigDirectory) 'plugins') 'obsidian-leaflet-plugin'
if (!(Test-Path -LiteralPath $target -PathType Container)) {
    throw 'Existing Leaflet plugin directory not found; no files changed.'
}
$files = @('main.js','manifest.json','styles.css')
foreach ($file in $files) {
    $source = Join-Path $repo $file
    $destination = Join-Path $target $file
    if (!(Test-Path -LiteralPath $source -PathType Leaf) -or (Get-Item -LiteralPath $source).Length -eq 0) { throw "Missing or empty build file: $source" }
    if (!(Test-Path -LiteralPath $destination -PathType Leaf)) { throw "Missing installed file: $destination" }
}
$newManifest = Get-Content -LiteralPath (Join-Path $repo 'manifest.json') -Raw | ConvertFrom-Json
$oldManifest = Get-Content -LiteralPath (Join-Path $target 'manifest.json') -Raw | ConvertFrom-Json
if ($newManifest.id -ne 'obsidian-leaflet-plugin' -or $oldManifest.id -ne $newManifest.id) { throw 'Plugin identity mismatch; no files changed.' }
$backupRoot = Join-Path $env:LOCALAPPDATA 'LeafletLocalTestBackups'
$backup = Join-Path $backupRoot ([DateTime]::UtcNow.ToString('yyyyMMdd-HHmmss-fff') + '-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $backup -Force | Out-Null
Copy-Item -LiteralPath $target -Destination $backup -Recurse -ErrorAction Stop
$backupPlugin = Join-Path $backup 'obsidian-leaflet-plugin'
foreach ($file in $files) {
    if (!(Test-Path -LiteralPath (Join-Path $backupPlugin $file) -PathType Leaf)) { throw 'Backup verification failed; no plugin files changed.' }
}
try {
    foreach ($file in $files) {
        Copy-Item -LiteralPath (Join-Path $repo $file) -Destination (Join-Path $target $file) -Force
        if ((Get-FileHash -LiteralPath (Join-Path $repo $file)).Hash -ne (Get-FileHash -LiteralPath (Join-Path $target $file)).Hash) { throw "Installed file hash mismatch: $file" }
    }
} catch {
    foreach ($file in $files) {
        Copy-Item -LiteralPath (Join-Path $backupPlugin $file) -Destination (Join-Path $target $file) -Force
    }
    throw
}
Write-Host "Original version: $($oldManifest.version)"
Write-Host "Test bundle version: $($newManifest.version)"
Write-Host "Backup: $backupPlugin"
Write-Host "Installed: $target"
Write-Host 'Settings and marker data preserved. Reopen Obsidian to test.'
