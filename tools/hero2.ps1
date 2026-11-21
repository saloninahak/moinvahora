Set-Location 'e:\other\moin-film'
"start" | Out-File tools\hero2.txt
cmd /c "npx.cmd tsc --noEmit 2>&1" | Out-File tools\tsc16.log
"exit=$LASTEXITCODE" | Out-File -Append tools\tsc16.log
powershell -NoProfile -ExecutionPolicy Bypass -File tools\restart-dev.ps1
Start-Sleep 12
try { Invoke-WebRequest -UseBasicParsing http://localhost:3000/ -TimeoutSec 120 | Out-Null } catch {}
$env:BASE = 'http://localhost:3000'
node tools/shot/hero2.mjs *> tools\hero2.err
Copy-Item tools\hero2.txt tools\hero2-r1.txt
