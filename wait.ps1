for ($i = 0; $i -lt 60; $i++) {
    $conn = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "Backend ready after $i seconds"
        exit 0
    }
    Start-Sleep 1
}
Write-Host "Timeout"
exit 1
