# Create the private GitHub repo and push the committed site.
$log = 'tools\gh-push.txt'
"start $(Get-Date -Format s)" | Out-File $log
gh repo create moinvahora --private --source . --remote origin --push --description "Moin Vahora portfolio" 2>&1 | Out-File -Append $log
"--- remote ---" | Out-File -Append $log
git remote -v 2>&1 | Out-File -Append $log
"--- status ---" | Out-File -Append $log
git status -sb 2>&1 | Select-Object -First 2 | Out-File -Append $log
"--- done $(Get-Date -Format s) ---" | Out-File -Append $log
