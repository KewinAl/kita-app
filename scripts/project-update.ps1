param(
    [switch]$AuditFix
)

$ErrorActionPreference = "Stop"

Write-Host "== Project Dependency Update =="
npm outdated

Write-Host "`nApplying updates within allowed semver ranges..."
npm update
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if ($AuditFix) {
    Write-Host "`nApplying npm audit fixes..."
    npm audit fix
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "`nDependency update complete."
