Set-Location 'e:\other\moin-film'
(git status -sb | Select-Object -First 15; git log --oneline -2) *> tools\gs.txt
