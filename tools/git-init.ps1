# Initialise the local repo and make the first commit (local only, nothing is pushed).
$log = 'tools\git-init.txt'
git init -b main 2>&1 | Out-File $log
git add -A 2>&1 | Out-File -Append $log
"--- staged files ---" | Out-File -Append $log
git diff --cached --name-only 2>&1 | Out-File -Append $log
"--- size ---" | Out-File -Append $log
git count-objects -vH 2>&1 | Out-File -Append $log
