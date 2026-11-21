Set-Location 'e:\other\moin-film'
"start" | Out-File tools\haptest.txt
powershell -NoProfile -ExecutionPolicy Bypass -File tools\restart-dev.ps1
Start-Sleep 12
try { Invoke-WebRequest -UseBasicParsing http://localhost:3000/ -TimeoutSec 120 | Out-Null } catch {}
try { Invoke-WebRequest -UseBasicParsing http://localhost:3000/work -TimeoutSec 120 | Out-Null } catch {}
$env:BASE = 'http://localhost:3000'
node tools/shot/haptest.mjs *> tools\haptest.err
Copy-Item tools\haptest.txt tools\haptest-r4.txt
