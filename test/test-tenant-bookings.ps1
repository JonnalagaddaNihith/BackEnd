# Test GET /api/bookings/tenant/me endpoint
# This endpoint retrieves all bookings for the logged-in tenant

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testing GET /api/bookings/tenant/me" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as Tenant
Write-Host "[STEP 1] Logging in as Tenant..." -ForegroundColor Yellow
try {
    $tenantLogin = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body (@{
        email    = "testuser1302764448@example.com"
        password = "SecurePass123!"
    } | ConvertTo-Json) -Headers @{"Content-Type" = "application/json"}
    
    $tenantToken = $tenantLogin.data.token
    $tenantName = $tenantLogin.data.user.name
    Write-Host "[OK] Tenant login successful!" -ForegroundColor Green
    Write-Host "Tenant: $tenantName" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Tenant login failed" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message }
    exit
}
Write-Host ""

# Step 2: Get tenant's bookings
Write-Host "[STEP 2] Fetching tenant's bookings..." -ForegroundColor Yellow
try {
    $bookings = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/tenant/me" -Method GET -Headers @{
        "Authorization" = "Bearer $tenantToken"
        "Content-Type" = "application/json"
    }
    
    if ($bookings.data.Count -eq 0) {
        Write-Host "[INFO] No bookings found for this tenant" -ForegroundColor Yellow
        Write-Host "      Create a booking first using: .\test-create-booking.ps1" -ForegroundColor Gray
    } else {
        Write-Host "[OK] Found $($bookings.data.Count) booking(s)" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your Bookings:" -ForegroundColor Cyan
        Write-Host ""
        
        $bookings.data | ForEach-Object {
            # Status color
            $statusColor = switch ($_.status) {
                "Pending" { "Yellow" }
                "Approved" { "Green" }
                "Rejected" { "Red" }
                default { "White" }
            }
            
            Write-Host "  Booking ID: $($_.id)" -ForegroundColor White
            Write-Host "    Property    : $($_.property_title)" -ForegroundColor Gray
            Write-Host "    Check-in    : $($_.check_in)" -ForegroundColor Gray
            Write-Host "    Check-out   : $($_.check_out)" -ForegroundColor Gray
            Write-Host "    Status      : $($_.status)" -ForegroundColor $statusColor
            Write-Host "    Requested   : $($_.request_time)" -ForegroundColor Gray
            
            # Calculate duration
            $checkIn = [DateTime]::Parse($_.check_in)
            $checkOut = [DateTime]::Parse($_.check_out)
            $duration = ($checkOut - $checkIn).Days
            Write-Host "    Duration    : $duration days" -ForegroundColor Gray
            Write-Host ""
        }
        
        # Summary by status
        $pending = ($bookings.data | Where-Object { $_.status -eq 'Pending' }).Count
        $approved = ($bookings.data | Where-Object { $_.status -eq 'Approved' }).Count
        $rejected = ($bookings.data | Where-Object { $_.status -eq 'Rejected' }).Count
        
        Write-Host "Summary:" -ForegroundColor Cyan
        Write-Host "  Pending : $pending" -ForegroundColor Yellow
        Write-Host "  Approved: $approved" -ForegroundColor Green
        Write-Host "  Rejected: $rejected" -ForegroundColor Red
        Write-Host ""
        
        Write-Host "Full Response:" -ForegroundColor Gray
        $bookings | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "[ERROR] Failed to fetch bookings" -ForegroundColor Red
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
Write-Host ""
Write-Host "API Endpoint Used:" -ForegroundColor Cyan
Write-Host "  GET /api/bookings/tenant/me" -ForegroundColor White
Write-Host ""
Write-Host "This endpoint returns:" -ForegroundColor Cyan
Write-Host "  - All bookings created by the logged-in tenant" -ForegroundColor White
Write-Host "  - Bookings with all statuses (Pending, Approved, Rejected)" -ForegroundColor White
Write-Host "  - Property details and dates for each booking" -ForegroundColor White
