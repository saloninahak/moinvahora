# Commit vercel.json (+ README) and push; Vercel redeploys on push.
$log = 'tools\gh-fixdeploy.txt'
"start $(Get-Date -Format s)" | Out-File $log
git add vercel.json README.md 2>&1 | Out-Null
git -c user.name="Moin Vahora" -c user.email="vahoramoin2896@gmail.com" commit -q -m "Vercel: use the Next.js framework preset" 2>&1 | Out-File -Append $log
git push origin main 2>&1 | Out-File -Append $log
"--- head ---" | Out-File -Append $log
git log --oneline -3 2>&1 | Out-File -Append $log
git status -sb 2>&1 | Select-Object -First 1 | Out-File -Append $log
"--- done $(Get-Date -Format s) ---" | Out-File -Append $log
