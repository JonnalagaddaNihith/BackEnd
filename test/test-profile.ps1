# Test /api/users/profile endpoint
# This endpoint requires authentication

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testing /api/users/profile Endpoint" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login to get token
Write-Host "[STEP 1] Logging in to get authentication token..." -ForegroundColor Yellow
$loginBody = @{
    email    = "nihit@gmail.com"
    password = "SecurePass123!"
} | ConvertTo-Json

$token = ""
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -Headers @{"Content-Type" = "application/json"}
    
    if ($loginResponse.success) {
        $token = $loginResponse.data.token
        Write-Host "[OK] Login successful!" -ForegroundColor Green
        Write-Host "Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
    } else {
        Write-Host "[FAIL] Login failed" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "[ERROR] Login failed" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message
    }
    exit
}

Write-Host ""

# Step 2: Get profile using the token
Write-Host "[STEP 2] Getting user profile..." -ForegroundColor Yellow
try {
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/users/profile" -Method GET -Headers @{
        "Content-Type"  = "application/json"
        "Authorization" = "Bearer $token"
    }
    
    if ($profileResponse.success) {
        Write-Host "[OK] Profile retrieved successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Profile Details:" -ForegroundColor Cyan
        Write-Host "  ID         : $($profileResponse.data.id)" -ForegroundColor White
        Write-Host "  Name       : $($profileResponse.data.name)" -ForegroundColor White
        Write-Host "  Email      : $($profileResponse.data.email)" -ForegroundColor White
        Write-Host "  Role       : $($profileResponse.data.role)" -ForegroundColor White
        Write-Host "  Created At : $($profileResponse.data.created_at)" -ForegroundColor White
        Write-Host ""
        Write-Host "Full Response:" -ForegroundColor Gray
        $profileResponse | ConvertTo-Json -Depth 3
    } else {
        Write-Host "[FAIL] Profile retrieval failed" -ForegroundColor Red
        $profileResponse | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "[ERROR] Profile request failed" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Error details:" -ForegroundColor Yellow
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
