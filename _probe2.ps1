$ErrorActionPreference = 'Continue'
$base = 'http://localhost:8081/api'
$login = @{ username='nora.shopper.t13@example.com'; password='Password@123' } | ConvertTo-Json
$lr = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body $login -ContentType 'application/json'
Write-Host "LOGIN role=$($lr.data.role)"
$h = @{ Authorization = "Bearer $($lr.data.token)" }

function Hit($url) {
  try {
    $r = Invoke-WebRequest -Uri $url -Headers $h -UseBasicParsing
    Write-Host "$url -> $($r.StatusCode)"
    Write-Host $r.Content
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "$url -> $code : $($_.ErrorDetails.Message)"
  }
}

Hit "$base/auth/me"
Hit "$base/my/orders"
