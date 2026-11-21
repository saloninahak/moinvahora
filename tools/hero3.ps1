Set-Location 'e:\other\moin-film'
$env:BASE = 'http://localhost:3000'
node tools/shot/hero2.mjs *> tools\hero2.err
Copy-Item tools\hero2.txt tools\hero2-r2.txt
