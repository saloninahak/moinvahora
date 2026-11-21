Set-Location 'e:\other\moin-film'
"start" | Out-File tools\folders.txt
$env:BASE = 'http://localhost:3000'
node tools/shot/folders.mjs *> tools\folders.err
Copy-Item tools\folders.txt tools\folders-r2.txt
