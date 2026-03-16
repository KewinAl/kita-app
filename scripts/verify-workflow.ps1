param(
    [switch]$Build
)

$ErrorActionPreference = "Stop"

Write-Host "== Verify Project State =="
$eslintConfigCandidates = @(
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.cjs",
    ".eslintrc",
    ".eslintrc.json",
    ".eslintrc.js",
    ".eslintrc.cjs"
)

$hasEslintConfig = $false
foreach ($candidate in $eslintConfigCandidates) {
    if (Test-Path $candidate) {
        $hasEslintConfig = $true
        break
    }
}

if ($hasEslintConfig) {
    npm run lint
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
else {
    Write-Host "Skipping lint: no ESLint config found (avoids interactive Next.js prompt)."
}

if ($Build) {
    Write-Host "`nRunning production build..."
    npm run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "`nVerification complete."
