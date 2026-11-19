Set-Location 'e:\other\moin-film'
$env:BASE = 'http://localhost:3000'
node tools/shot/ledger.mjs *> tools\ledger.txt
"done" | Out-File -Append tools\ledger.txt
