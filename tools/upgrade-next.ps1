# Upgrade Next.js to the latest patched 15.5.x, rebuild, and push.
$log = 'e:\other\moin-film\tools\upgrade-next.txt'
Set-Location 'e:\other\moin-film'
"start $(Get-Date -Format s)" | Out-File $log
cmd /c "npm install next@^15.5.7 --save-exact --no-audit --no-fund 2>&1" | Select-Object -Last 6 | Out-File -Append $log
"install exit=$LASTEXITCODE" | Out-File -Append $log
"next now: $((Get-Content package.json -Raw | ConvertFrom-Json).dependencies.next)" | Out-File -Append $log
"installed: $((Get-Content node_modules\next\package.json -Raw | ConvertFrom-Json).version)" | Out-File -Append $log
"--- build ---" | Out-File -Append $log
cmd /c "npm run build 2>&1" | Select-Object -Last 14 | Out-File -Append $log
$b = $LASTEXITCODE
"build exit=$b" | Out-File -Append $log
if ($b -eq 0) {
  git add package.json package-lock.json 2>&1 | Out-Null
  git -c user.name="Moin Vahora" -c user.email="vahoramoin2896@gmail.com" commit -q -m "Upgrade Next.js to a patched 15.5.x (CVE-2025-66478)" 2>&1 | Out-File -Append $log
  git push -q origin main 2>&1 | Out-File -Append $log
  "--- pushed ---" | Out-File -Append $log
  git log --oneline -1 2>&1 | Out-File -Append $log
}
"--- done $(Get-Date -Format s) ---" | Out-File -Append $log
