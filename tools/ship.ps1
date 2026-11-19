# Build, then commit and push only if the build passes. Vercel redeploys on push.
$log = 'e:\other\moin-film\tools\ship.txt'
Set-Location 'e:\other\moin-film'
"start $(Get-Date -Format s)" | Out-File $log
cmd /c "npm run build 2>&1" | Select-Object -Last 6 | Out-File -Append $log
$b = $LASTEXITCODE
"build exit=$b" | Out-File -Append $log
if ($b -ne 0) { "STOPPED: build failed, nothing pushed" | Out-File -Append $log; exit 1 }
git add -A 2>&1 | Out-Null
"--- staged ---" | Out-File -Append $log
git diff --cached --name-only 2>&1 | Out-File -Append $log
git -c user.name="Moin Vahora" -c user.email="vahoramoin2896@gmail.com" commit -q -m "Contact panel from the dock, haptics on phones" 2>&1 | Out-File -Append $log
git push -q origin main 2>&1 | Out-File -Append $log
"--- pushed ---" | Out-File -Append $log
git log --oneline -1 2>&1 | Out-File -Append $log
git status -sb 2>&1 | Select-Object -First 1 | Out-File -Append $log
"--- done $(Get-Date -Format s) ---" | Out-File -Append $log
