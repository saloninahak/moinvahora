# Commit and push the README.
$log = 'tools\gh-readme.txt'
git add README.md 2>&1 | Out-Null
git -c user.name="Moin Vahora" -c user.email="vahoramoin2896@gmail.com" commit -q -m "README: public overview" 2>&1 | Out-File $log
git push -q origin main 2>&1 | Out-File -Append $log
git log --oneline -1 2>&1 | Out-File -Append $log
git status -sb 2>&1 | Select-Object -First 1 | Out-File -Append $log
"done" | Out-File -Append $log
