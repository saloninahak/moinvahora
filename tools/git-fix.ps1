# Untrack private/debug files (they stay on disk) and amend the unpushed first commit.
$log = 'tools\git-fix.txt'
$files = @(
  'content/moin-facts.ts', 'docs/archive-v1/content/moin-facts.ts', 'tools/transcribe.py',
  'tools/npm.err', 'tools/npm.out', 'tools/run.err', 'tools/run.out',
  'tools/shot/desktop.err', 'tools/shot/desktop.out', 'tools/shot/study.err', 'tools/shot/study.out',
  'tools/shot/study2.err', 'tools/shot/study2.out', 'tools/shot/dist.txt'
)
foreach ($f in $files) { git rm --cached --ignore-unmatch -q -- $f 2>&1 | Out-File -Append $log }
git -c user.name="Moin Vahora" -c user.email="vahoramoin2896@gmail.com" commit -q --amend --no-edit 2>&1 | Out-File -Append $log
"--- tracked: $((git ls-files).Count) files ---" | Out-File -Append $log
"--- still tracked (should be empty) ---" | Out-File -Append $log
git ls-files | Select-String -Pattern 'moin-facts|transcribe|\.err$|\.out$|env\.txt|audio|dist\.txt' | Out-File -Append $log
"--- head ---" | Out-File -Append $log
git log --oneline -1 2>&1 | Out-File -Append $log
"--- done ---" | Out-File -Append $log
