# Re-stage after .gitignore changes and make the first local commit (nothing is pushed).
$log = 'tools\git-restage.txt'
git rm -r --cached . -q 2>&1 | Out-Null
git add -A 2>&1 | Out-Null
git -c user.name="Moin Vahora" -c user.email="vahoramoin2896@gmail.com" commit -q -m "Moin Vahora portfolio: story home, work index, case studies" 2>&1 | Out-File $log
"--- tracked: $((git ls-files).Count) files ---" | Out-File -Append $log
git ls-files | Select-String -Pattern 'moin-facts|transcribe|\.err$|\.out$|env\.txt|audio' | Out-File -Append $log
"--- head ---" | Out-File -Append $log
git log --oneline -1 2>&1 | Out-File -Append $log
