$body = @{
    name     = "Nihit"
    email    = "nihit@gmail.com"
    password = "SecurePass123!"
    role     = "tenant"
} | ConvertTo-Json

Write-Host "Testing registration endpoint..." -ForegroundColor Yellow
Write-Host "Body: $body" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -Headers @{"Content-Type" = "application/json"}
    Write-Host "[OK] Registration successful!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "[FAIL] Registration failed" -ForegroundColor Red
    $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        Write-Host "Error Details:" -ForegroundColor Yellow
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
    }
}
