# Download one image: tools/shot/get.ps1 <url> <outfile>
param([string]$Url, [string]$Out)
$ProgressPreference = 'SilentlyContinue'
try {
  Invoke-WebRequest -Uri $Url -OutFile $Out -UseBasicParsing -TimeoutSec 60 -Headers @{ 'User-Agent' = 'moin-portfolio-dev/1.0 (local build)' }
  "OK $((Get-Item $Out).Length) $Out" | Out-File -Append tools\shot\get.log
} catch {
  "ERR $Url $($_.Exception.Message)" | Out-File -Append tools\shot\get.log
}
