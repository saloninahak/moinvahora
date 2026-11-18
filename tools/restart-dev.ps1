# Stop this project's stale Next.js dev servers (ports 3000-3004) and start one fresh on 3000.
# Only kills node.exe processes whose command line points at this project's Next.js.
$log = 'tools\restart.log'
"start $(Get-Date -Format s)" | Out-File $log
$pids = @()
foreach ($line in (netstat -ano | Select-String 'LISTENING')) {
  $parts = ($line.ToString().Trim() -split '\s+')
  if ($parts[1] -match ':(300[0-4])$') { $pids += [int]$parts[-1] }
}
$pids = $pids | Sort-Object -Unique
foreach ($procId in $pids) {
  $p = Get-CimInstance Win32_Process -Filter "ProcessId=$procId" -ErrorAction SilentlyContinue
  $cmd = "$($p.CommandLine)"
  if ($p.Name -eq 'node.exe' -and $cmd -match 'moin-film' -and $cmd -match 'next') {
    # Kill the whole tree (npm -> next -> workers).
    taskkill /PID $procId /T /F | Out-Null
    "killed $procId :: $cmd" | Out-File -Append $log
  } else {
    "kept $procId $($p.Name) :: $cmd" | Out-File -Append $log
  }
}
Start-Sleep -Seconds 2
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c npm.cmd run dev > tools\dev.log 2>&1' -WorkingDirectory (Get-Location) -WindowStyle Hidden
"started $(Get-Date -Format s)" | Out-File -Append $log
