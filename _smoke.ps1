$ErrorActionPreference = 'Stop'
$base = 'http://localhost:8081/api'

function Show($label, $obj) {
  Write-Host "==== $label ===="
  $obj | ConvertTo-Json -Depth 6
  Write-Host ""
}

# 1. Register a normal user (should become ROLE_USER)
$email = "shopper_$(Get-Random)@example.com"
$reg = @{ firstName='Shop'; lastName='Tester'; email=$email; password='Password@123'; phone='1234567890' } | ConvertTo-Json
try {
  $r = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -Body $reg -ContentType 'application/json'
  Show 'REGISTER' $r
} catch {
  Write-Host "REGISTER failed: $($_.Exception.Message)"
  if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message }
}

# 2. Login as the new user
$login = @{ username=$email; password='Password@123' } | ConvertTo-Json
$lr = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body $login -ContentType 'application/json'
$token = $lr.data.token
$role = $lr.data.role
Write-Host "LOGIN ok role=$role token=$($token.Substring(0,15))..."
$h = @{ Authorization = "Bearer $token" }

# 3. Catalog
$cat = Invoke-RestMethod -Uri "$base/shop/catalog" -Headers $h
Write-Host "CATALOG categories=$($cat.data.Count)"
$firstCat = $cat.data | Select-Object -First 1
$firstProduct = $firstCat.products | Select-Object -First 1
Write-Host "First product: $($firstProduct.name) id=$($firstProduct.id) stock=$($firstProduct.stock) price=$($firstProduct.price)"

# 4. Place an order for 2 units
$order = @{ shippingAddress='123 Test St'; items=@(@{ productId=$firstProduct.id; quantity=2 }) } | ConvertTo-Json
$or = Invoke-RestMethod -Uri "$base/shop/orders" -Method Post -Body $order -Headers $h -ContentType 'application/json'
Show 'PLACE ORDER' $or

# 5. Verify stock decremented
$cat2 = Invoke-RestMethod -Uri "$base/shop/catalog" -Headers $h
$p2 = ($cat2.data | ForEach-Object { $_.products } | Where-Object { $_.id -eq $firstProduct.id })
Write-Host "Stock after order: $($p2.stock) (was $($firstProduct.stock))"

# 6. My orders
$mine = Invoke-RestMethod -Uri "$base/my/orders" -Headers $h
Write-Host "MY ORDERS count=$($mine.data.Count) firstOrder=$($mine.data[0].orderNumber)"

# 7. USER blocked from staff endpoint (expect 403)
try {
  Invoke-RestMethod -Uri "$base/users" -Headers $h | Out-Null
  Write-Host "ERROR: USER could access /users (should be 403)"
} catch {
  Write-Host "USER blocked from /users -> $($_.Exception.Response.StatusCode.value__) (expected 403)"
}

# 8. USER blocked from dashboard (expect 403)
try {
  Invoke-RestMethod -Uri "$base/dashboard" -Headers $h | Out-Null
  Write-Host "ERROR: USER could access /dashboard (should be 403)"
} catch {
  Write-Host "USER blocked from /dashboard -> $($_.Exception.Response.StatusCode.value__) (expected 403)"
}
