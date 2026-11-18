# Which local dev ports answer? Writes tools/ping.txt
$out = foreach ($p in 3000, 3001, 3002) {
  try { $r = Invoke-WebRequest "http://localhost:$p/" -UseBasicParsing -TimeoutSec 60; "$p $($r.StatusCode) story=$($r.Content.Contains('Cut to'))" } catch { "$p down" }
}
$out | Out-File tools\ping.txt
