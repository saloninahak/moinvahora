Set-Location 'e:\other\moin-film'
$env:BASE = 'http://localhost:3000'
node tools/shot/haptest.mjs *> tools\haptest.err
Copy-Item tools\haptest.txt tools\haptest-r5.txt
