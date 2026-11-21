Set-Location 'e:\other\moin-film'
"start" | Out-File tools\haptest.txt
powershell -NoProfile -ExecutionPolicy Bypass -File tools\restart-dev.ps1
Start-Sleep 12
$env:BASE = 'http://localhost:3000'
# Warm up the routes so the first test page isn't a cold compile.
try { Invoke-WebRequest -UseBasicParsing http://localhost:3000/ -TimeoutSec 120 | Out-Null } catch {}
try { Invoke-WebRequest -UseBasicParsing http://localhost:3000/work -TimeoutSec 120 | Out-Null } catch {}
node tools/shot/haptest.mjs *> tools\haptest.err
