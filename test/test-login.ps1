# Test login endpoint
$loginBody = @{
    email    = "nihit@gmail.com"
    password = "SecurePass123!"
} | ConvertTo-Json

Write-Host "[TEST] Testing login endpoint..." -ForegroundColor Cyan
Write-Host "Email: nihit@gmail.com" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -Headers @{"Content-Type" = "application/json"}
    
    if ($response.success) {
        Write-Host "[OK] Login successful!" -ForegroundColor Green
        Write-Host "User: $($response.data.user.name)" -ForegroundColor White
        Write-Host "Role: $($response.data.user.role)" -ForegroundColor White
        Write-Host "Token: $($response.data.token.Substring(0, 30))..." -ForegroundColor Gray
    } else {
        Write-Host "[FAIL] Login failed" -ForegroundColor Red
        $response | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "[ERROR] Request failed" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Error details:" -ForegroundColor Yellow
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Yellow
    }
}
