# Reproduce Vercel: fresh clone from GitHub, clean install, production build.
$log = 'e:\other\moin-film\tools\clean-build.txt'
$dir = Join-Path $env:TEMP 'moinvahora-check'
"start $(Get-Date -Format s)" | Out-File $log
if (Test-Path $dir) { Remove-Item -Recurse -Force $dir }
git clone --depth 1 https://github.com/saloninahak/moinvahora.git $dir 2>&1 | Out-File -Append $log
Set-Location $dir
"--- files: $((git ls-files).Count) ---" | Out-File -Append $log
"--- npm ci ---" | Out-File -Append $log
cmd /c "npm ci --no-audit --no-fund 2>&1" | Select-Object -Last 8 | Out-File -Append $log
"npm ci exit=$LASTEXITCODE" | Out-File -Append $log
"--- build ---" | Out-File -Append $log
cmd /c "npm run build 2>&1" | Select-Object -Last 25 | Out-File -Append $log
"build exit=$LASTEXITCODE" | Out-File -Append $log
"--- output ---" | Out-File -Append $log
"BUILD_ID present: $(Test-Path .next\BUILD_ID)" | Out-File -Append $log
"--- done $(Get-Date -Format s) ---" | Out-File -Append $log
