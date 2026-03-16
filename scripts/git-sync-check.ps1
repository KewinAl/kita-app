param()

$ErrorActionPreference = "Stop"

Write-Host "== Git Sync Check =="
git fetch --prune
$fetchExit = $LASTEXITCODE
if ($fetchExit -ne 0) {
    Write-Host "Git sync warning: fetch failed (network/auth issue). Using local refs."
}

git status -sb
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$hasUpstream = $true
try {
    git rev-parse --abbrev-ref --symbolic-full-name "@{u}" | Out-Null
}
catch {
    $hasUpstream = $false
}

if (-not $hasUpstream) {
    Write-Host "Git sync: no upstream configured for current branch."
    exit 0
}

$counts = git rev-list --left-right --count "@{u}...HEAD"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git sync warning: unable to read ahead/behind from upstream."
    exit 0
}

$parts = ($counts -split "\s+") | Where-Object { $_ -ne "" }
if ($parts.Count -lt 2) {
    Write-Host "Git sync warning: unable to parse ahead/behind counts."
    exit 0
}

$behind = [int]$parts[0]
$ahead = [int]$parts[1]

if ($behind -eq 0 -and $ahead -eq 0) {
    Write-Host "Git sync: local and upstream are in sync."
}
elseif ($behind -gt 0 -and $ahead -eq 0) {
    Write-Host "Git sync: local is behind upstream by $behind commit(s). Consider pull/rebase."
}
elseif ($behind -eq 0 -and $ahead -gt 0) {
    Write-Host "Git sync: local is ahead of upstream by $ahead commit(s). Consider push."
}
else {
    Write-Host "Git sync: local and upstream diverged (behind=$behind, ahead=$ahead)."
}
