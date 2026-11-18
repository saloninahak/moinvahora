# Check deploy prerequisites. Writes tools/deploy-check.txt
$out = @()
foreach ($cmd in 'git', 'gh', 'vercel', 'node', 'npm') {
  $c = Get-Command $cmd -ErrorAction SilentlyContinue
  $out += "$cmd : $(if ($c) { $c.Source } else { 'NOT FOUND' })"
}
try { $out += "git version: $(git --version 2>&1)" } catch { $out += 'git version: error' }
try { $out += "gh auth: $((gh auth status 2>&1) -join ' | ')" } catch { $out += 'gh auth: n/a' }
try { $out += "vercel whoami: $((vercel whoami 2>&1) -join ' | ')" } catch { $out += 'vercel: n/a' }
foreach ($u in 'https://github.com', 'https://api.vercel.com') {
  try { $r = Invoke-WebRequest $u -UseBasicParsing -TimeoutSec 20 -Method Head; $out += "net $u : $($r.StatusCode)" } catch { $out += "net $u : FAIL $($_.Exception.Message)" }
}
$out | Out-File tools\deploy-check.txt
