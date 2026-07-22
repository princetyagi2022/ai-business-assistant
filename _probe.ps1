$ErrorActionPreference = 'Continue'
$base = 'http://localhost:8081/api'

# Login as admin
$login = @{ username='princetyagi9997@gmail.com'; password='prince@#1221' } | ConvertTo-Json
try {
  $lr = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body $login -ContentType 'application/json'
  Write-Host "ADMIN login role=$($lr.data.role)"
} catch {
  Write-Host "ADMIN login failed: $($_.ErrorDetails.Message)"
  exit 1
}
$h = @{ Authorization = "Bearer $($lr.data.token)" }

function Hit($label, $url) {
  try {
    $r = Invoke-WebRequest -Uri $url -Headers $h -UseBasicParsing
    Write-Host "$label $url -> $($r.StatusCode)"
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "$label $url -> $code"
  }
}

# Staff should access all of these (200)
Hit 'ADMIN' "$base/agents"
Hit 'ADMIN' "$base/dashboard"
Hit 'ADMIN' "$base/users"
Hit 'ADMIN' "$base/inventory"
Hit 'ADMIN' "$base/agents"
$ErrorActionPreference = 'Continue'
$base = 'http://localhost:8081/api'
$email = "probe_$(Get-Random)@example.com"
$reg = @{ firstName='P'; lastName='Q'; email=$email; password='Password@123'; phone='1' } | ConvertTo-Json
Invoke-RestMethod -Uri "$base/auth/register" -Method Post -Body $reg -ContentType 'application/json' | Out-Null
$login = @{ username=$email; password='Password@123' } | ConvertTo-Json
$lr = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body $login -ContentType 'application/json'
$h = @{ Authorization = "Bearer $($lr.data.token)" }

function Hit($url) {
  try {
    $r = Invoke-WebRequest -Uri $url -Headers $h -UseBasicParsing
    Write-Host "$url -> $($r.StatusCode)"
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "$url -> $code : $($_.ErrorDetails.Message)"
  }
}

Hit "$base/shop/catalog"
Hit "$base/my/orders"
Hit "$base/agents"
