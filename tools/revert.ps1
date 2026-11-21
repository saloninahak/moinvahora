$log = 'e:\other\moin-film\tools\revert2.txt'
Set-Location 'e:\other\moin-film'
"start" | Out-File $log
git restore --source=aa92476 --staged --worktree -- src content 2>&1 | Out-File -Append $log
"--- status ---" | Out-File -Append $log
git status --short -- src content 2>&1 | Out-File -Append $log
cmd /c "npm run build 2>&1" | Select-Object -Last 4 | Out-File -Append $log
$b = $LASTEXITCODE
"build exit=$b" | Out-File -Append $log
if ($b -ne 0) { "STOPPED" | Out-File -Append $log; exit 1 }
git add -A src content tools/ship.ps1 2>&1 | Out-Null
git -c user.name="Moin Vahora" -c user.email="vahoramoin2896@gmail.com" commit -q -m "Restore previous work and film pages" 2>&1 | Out-File -Append $log
git push -q origin main 2>&1 | Out-File -Append $log
git log --oneline -2 2>&1 | Out-File -Append $log
git diff aa92476 --stat -- src content 2>&1 | Out-File -Append $log
"done" | Out-File -Append $log
