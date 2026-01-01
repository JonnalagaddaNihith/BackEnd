# Test POST /api/bookings endpoint
# This endpoint requires Tenant authentication

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testing POST /api/bookings Endpoint" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as Tenant to get token
Write-Host "[STEP 1] Logging in as Tenant..." -ForegroundColor Yellow
$loginBody = @{
    email    = "testuser1302764448@example.com"
    password = "SecurePass123!"
} | ConvertTo-Json

$tenantToken = ""
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -Headers @{"Content-Type" = "application/json"}
    
    if ($loginResponse.success) {
        $tenantToken = $loginResponse.data.token
        Write-Host "[OK] Tenant login successful!" -ForegroundColor Green
        Write-Host "Tenant: $($loginResponse.data.user.name)" -ForegroundColor Gray
        Write-Host "Token: $($tenantToken.Substring(0, 30))..." -ForegroundColor Gray
    } else {
        Write-Host "[FAIL] Tenant login failed" -ForegroundColor Red
        $loginResponse | ConvertTo-Json -Depth 3
        exit
    }
} catch {
    Write-Host "[ERROR] Tenant login failed" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Yellow
    }
    exit
}

Write-Host ""

# Step 2: Get available properties
Write-Host "[STEP 2] Fetching available properties..." -ForegroundColor Yellow
$propertyId = 0
try {
    $propertiesResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/properties" -Method GET
    
    if ($propertiesResponse.success -and $propertiesResponse.data.Count -gt 0) {
        $propertyId = $propertiesResponse.data[0].id
        Write-Host "[OK] Found $($propertiesResponse.data.Count) properties" -ForegroundColor Green
        Write-Host "Using Property:" -ForegroundColor Gray
        Write-Host "  ID: $propertyId" -ForegroundColor Gray
        Write-Host "  Title: $($propertiesResponse.data[0].title)" -ForegroundColor Gray
        Write-Host "  Rent: ₹$($propertiesResponse.data[0].rent_per_day)/day" -ForegroundColor Gray
    } else {
        Write-Host "[WARN] No properties found. Please create a property first." -ForegroundColor Yellow
        exit
    }
} catch {
    Write-Host "[ERROR] Failed to fetch properties" -ForegroundColor Red
    exit
}

Write-Host ""

# Step 3: Create a booking
Write-Host "[STEP 3] Creating a booking..." -ForegroundColor Yellow

# Calculate dates (check-in tomorrow, check-out in 7 days)
$checkIn = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$checkOut = (Get-Date).AddDays(8).ToString("yyyy-MM-dd")

$bookingData = @{
    property_id = $propertyId
    check_in    = $checkIn
    check_out   = $checkOut
} | ConvertTo-Json

Write-Host "Booking Details:" -ForegroundColor Gray
Write-Host "  Property ID: $propertyId" -ForegroundColor Gray
Write-Host "  Check-in: $checkIn" -ForegroundColor Gray
Write-Host "  Check-out: $checkOut" -ForegroundColor Gray
Write-Host "  Duration: 7 days" -ForegroundColor Gray
Write-Host ""

try {
    $bookingResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings" -Method POST -Headers @{
        "Content-Type"  = "application/json"
        "Authorization" = "Bearer $tenantToken"
    } -Body $bookingData
    
    if ($bookingResponse.success) {
        Write-Host "[OK] Booking created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Created Booking:" -ForegroundColor Cyan
        Write-Host "  Booking ID   : $($bookingResponse.data.id)" -ForegroundColor White
        Write-Host "  Property ID  : $($bookingResponse.data.property_id)" -ForegroundColor White
        Write-Host "  Tenant ID    : $($bookingResponse.data.tenant_id)" -ForegroundColor White
        Write-Host "  Check-in     : $($bookingResponse.data.check_in)" -ForegroundColor White
        Write-Host "  Check-out    : $($bookingResponse.data.check_out)" -ForegroundColor White
        Write-Host "  Status       : $($bookingResponse.data.status)" -ForegroundColor White
        Write-Host "  Request Time : $($bookingResponse.data.request_time)" -ForegroundColor White
        Write-Host ""
        Write-Host "Full Response:" -ForegroundColor Gray
        $bookingResponse | ConvertTo-Json -Depth 3
    } else {
        Write-Host "[FAIL] Booking creation failed" -ForegroundColor Red
        $bookingResponse | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "[ERROR] Booking creation request failed" -ForegroundColor Red
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
Write-Host "TIP: Booking requirements:" -ForegroundColor Yellow
Write-Host "  - Must be logged in as a Tenant" -ForegroundColor Yellow
Write-Host "  - Required: property_id, check_in, check_out" -ForegroundColor Yellow
Write-Host "  - Check-in must be in the future" -ForegroundColor Yellow
Write-Host "  - Check-out must be after check-in" -ForegroundColor Yellow
Write-Host "  - Date format: YYYY-MM-DD" -ForegroundColor Yellow
