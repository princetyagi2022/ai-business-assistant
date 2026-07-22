$c = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue
if ($c) {
    $p = Get-Process -Id $c.OwningProcess
    Write-Host "Process on 8081: PID=$($p.Id), Name=$($p.ProcessName), Started=$($p.StartTime)"
} else {
    Write-Host "No process on port 8081"
}
