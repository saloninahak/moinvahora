Set-Location 'e:\other\moin-film'
"start" | Out-File tools\folders.txt
cmd /c "npx.cmd tsc --noEmit 2>&1" | Out-File tools\tsc14.log
"exit=$LASTEXITCODE" | Out-File -Append tools\tsc14.log
powershell -NoProfile -ExecutionPolicy Bypass -File tools\restart-dev.ps1
Start-Sleep 12
try { Invoke-WebRequest -UseBasicParsing http://localhost:3000/work -TimeoutSec 120 | Out-Null } catch {}
$env:BASE = 'http://localhost:3000'
node tools/shot/folders.mjs *> tools\folders.err
