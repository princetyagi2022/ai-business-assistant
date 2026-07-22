$conn = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue
if ($conn) {
    Stop-Process -Id $conn.OwningProcess -Force
    Write-Host "Backend stopped (PID: $($conn.OwningProcess))"
    Start-Sleep 2
} else {
    Write-Host "Backend not running"
}
