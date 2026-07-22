$ErrorActionPreference = "Continue"

# Test: Invalid token should return 401 (not 403)
try {
    $headers = @{ Authorization = "Bearer invalid_token_xyz" }
    Invoke-RestMethod -Uri "http://localhost:5173/api/auth/me" -Headers $headers
    Write-Host "UNEXPECTED: Request succeeded"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    Write-Host "Invalid token response: $statusCode"
    if ($statusCode -eq 401) {
        Write-Host "CORRECT: Returns 401"
    } elseif ($statusCode -eq 403) {
        Write-Host "ISSUE: Still returns 403 (backend may not have restarted)"
    } else {
        Write-Host "UNEXPECTED: Got $statusCode"
    }
}

# Test: Valid login still works
$body = '{"username":"admin","password":"prince@#1221"}'
try {
    $login = Invoke-RestMethod -Uri "http://localhost:5173/api/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "Login: OK - $($login.data.username)"
} catch {
    Write-Host "Login FAILED: $($_.Exception.Message)"
}
