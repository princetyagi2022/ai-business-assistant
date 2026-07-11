@echo off
echo Stopping AI Business Assistant local services...

powershell -NoProfile -Command "$ports = 5173,8000,8080; foreach ($port in $ports) { Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host ('Stopped process on port ' + $port) } }"

echo Done.
pause
