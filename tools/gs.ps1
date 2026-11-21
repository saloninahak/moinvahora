Set-Location 'e:\other\moin-film'
$o = 'tools\gs-' + (Get-Date -Format 'HHmmss') + '.txt'
(Get-Content tools\ship.txt; '--- git ---'; git log --oneline -3; git status -sb | Select-Object -First 12) *> $o
