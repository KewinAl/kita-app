param()

$ErrorActionPreference = "Stop"

Write-Host "== System/Toolchain Update =="

if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "Running winget upgrade..."
    winget upgrade --all --include-unknown --accept-source-agreements --accept-package-agreements
}
else {
    Write-Host "winget not found. Skipping OS package updates."
}

Write-Host "`nUpdating npm CLI..."
npm install -g npm@latest
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`nSystem/toolchain update complete."
