param(
    [switch]$UpdateDeps
)

$ErrorActionPreference = "Stop"

& "$PSScriptRoot/git-sync-check.ps1"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if ($UpdateDeps) {
    Write-Host ""
    & "$PSScriptRoot/project-update.ps1"
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "`n== Starting Dev Server =="
npm run dev
