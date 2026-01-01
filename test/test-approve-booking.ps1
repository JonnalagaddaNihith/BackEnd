# Test Owner Approval Endpoint
# PATCH /api/bookings/:id/status

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testing Booking Approval (Owner)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as Owner
Write-Host "[STEP 1] Logging in as Owner..." -ForegroundColor Yellow
try {
    $ownerLogin = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body (@{
        email    = "nihitowner@gmail.com"
        password = "SecurePass123!"
    } | ConvertTo-Json) -Headers @{"Content-Type" = "application/json"}
    
    $ownerToken = $ownerLogin.data.token
    Write-Host "[OK] Owner login successful!" -ForegroundColor Green
    Write-Host "Owner: $($ownerLogin.data.user.name)" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Owner login failed" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message }
    exit
}
Write-Host ""

# Step 2: Get pending bookings
Write-Host "[STEP 2] Fetching pending bookings..." -ForegroundColor Yellow
try {
    $bookings = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/owner/me" -Method GET -Headers @{
        "Authorization" = "Bearer $ownerToken"
        "Content-Type" = "application/json"
    }
    
    $pendingBookings = $bookings.data | Where-Object { $_.status -eq 'Pending' }
    
    if ($pendingBookings.Count -eq 0) {
        Write-Host "[INFO] No pending bookings found" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "All bookings:" -ForegroundColor Cyan
        $bookings.data | ForEach-Object {
            Write-Host "  ID $($_.id): $($_.tenant_name) - Status: $($_.status)" -ForegroundColor Gray
        }
        exit
    }
    
    Write-Host "[OK] Found $($pendingBookings.Count) pending booking(s)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pending Bookings:" -ForegroundColor Cyan
    $pendingBookings | ForEach-Object {
        Write-Host "  Booking ID: $($_.id)" -ForegroundColor White
        Write-Host "    Tenant: $($_.tenant_name)" -ForegroundColor Gray
        Write-Host "    Property: $($_.property_title)" -ForegroundColor Gray
        Write-Host "    Dates: $($_.check_in) to $($_.check_out)" -ForegroundColor Gray
        Write-Host "    Status: $($_.status)" -ForegroundColor Gray
        Write-Host ""
    }
    
    # Select first pending booking
    $bookingToApprove = $pendingBookings[0].id
    
} catch {
    Write-Host "[ERROR] Failed to fetch bookings" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message }
    exit
}

# Step 3: Approve the booking
Write-Host "[STEP 3] Approving booking ID: $bookingToApprove..." -ForegroundColor Yellow

try {
    $approval = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/$bookingToApprove/status" -Method PATCH -Headers @{
        "Authorization" = "Bearer $ownerToken"
        "Content-Type" = "application/json"
    } -Body (@{
        status = "Approved"
    } | ConvertTo-Json)
    
    Write-Host "[OK] Booking APPROVED successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Approved Booking Details:" -ForegroundColor Cyan
    Write-Host "  Booking ID  : $($approval.data.id)" -ForegroundColor White
    Write-Host "  Tenant      : $($approval.data.tenant_name)" -ForegroundColor White
    Write-Host "  Property    : $($approval.data.property_title)" -ForegroundColor White
    Write-Host "  Check-in    : $($approval.data.check_in)" -ForegroundColor White
    Write-Host "  Check-out   : $($approval.data.check_out)" -ForegroundColor White
    Write-Host "  Status      : $($approval.data.status)" -ForegroundColor Green
    Write-Host ""
    
    # Show full response
    Write-Host "Full Response:" -ForegroundColor Gray
    $approval | ConvertTo-Json -Depth 3
    
} catch {
    Write-Host "[ERROR] Failed to approve booking" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Error details:" -ForegroundColor Yellow
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Endpoint Used:" -ForegroundColor Cyan
Write-Host "  PATCH /api/bookings/{id}/status" -ForegroundColor White
Write-Host ""
Write-Host "Request Body Options:" -ForegroundColor Cyan
Write-Host '  {"status": "Approved"}  - Approve booking' -ForegroundColor White
Write-Host '  {"status": "Rejected"}  - Reject booking' -ForegroundColor White
Write-Host '  {"status": "Pending"}   - Reset to pending' -ForegroundColor White
