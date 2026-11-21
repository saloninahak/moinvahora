Set-Location 'e:\other\moin-film'
cmd /c "npx.cmd tsc --noEmit 2>&1" | Out-File tools\tsc13.log
"exit=$LASTEXITCODE" | Out-File -Append tools\tsc13.log
