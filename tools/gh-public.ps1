# Commit the latest edits, push, and make the GitHub repo public.
$log = 'tools\gh-public.txt'
"start $(Get-Date -Format s)" | Out-File $log
git add -A 2>&1 | Out-Null
git -c user.name="Moin Vahora" -c user.email="vahoramoin2896@gmail.com" commit -q -m "Prepare public release" 2>&1 | Out-File -Append $log
git push -q origin main 2>&1 | Out-File -Append $log
gh repo edit saloninahak/moinvahora --visibility public --accept-visibility-change-consequences 2>&1 | Out-File -Append $log
"--- visibility ---" | Out-File -Append $log
gh repo view saloninahak/moinvahora --json visibility,url,defaultBranchRef 2>&1 | Out-File -Append $log
"--- head ---" | Out-File -Append $log
git log --oneline -2 2>&1 | Out-File -Append $log
"--- done $(Get-Date -Format s) ---" | Out-File -Append $log
