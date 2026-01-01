# Test POST /api/properties endpoint
# This endpoint requires Owner authentication

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testing POST /api/properties Endpoint" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as Owner to get token
Write-Host "[STEP 1] Logging in as Owner..." -ForegroundColor Yellow
$loginBody = @{
    email    = "nihitowner@gmail.com"
    password = "SecurePass123!"
} | ConvertTo-Json

$ownerToken = ""
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -Headers @{"Content-Type" = "application/json"}
    
    if ($loginResponse.success) {
        $ownerToken = $loginResponse.data.token
        Write-Host "[OK] Owner login successful!" -ForegroundColor Green
        Write-Host "Owner: $($loginResponse.data.user.name)" -ForegroundColor Gray
        Write-Host "Token: $($ownerToken.Substring(0, 30))..." -ForegroundColor Gray
    } else {
        Write-Host "[FAIL] Owner login failed" -ForegroundColor Red
        $loginResponse | ConvertTo-Json -Depth 3
        exit
    }
} catch {
    Write-Host "[ERROR] Owner login failed" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Yellow
    }
    exit
}

Write-Host ""

# Step 2: Create a property
Write-Host "[STEP 2] Creating a new property..." -ForegroundColor Yellow

$propertyData = @{
    title               = "Luxury 3BHK Apartment in Downtown"
    property_description = "Beautiful spacious apartment with modern amenities, great view, and parking"
    rent_per_day        = 2500
    location            = "Downtown Mumbai, Maharashtra"
    amenities           = "WiFi,Parking,Gym,Swimming Pool,Security,Elevator"
} | ConvertTo-Json

Write-Host "Property Details:" -ForegroundColor Gray
Write-Host "  Title: Luxury 3BHK Apartment in Downtown" -ForegroundColor Gray
Write-Host "  Rent: ₹2500/day" -ForegroundColor Gray
Write-Host "  Location: Downtown Mumbai, Maharashtra" -ForegroundColor Gray
Write-Host ""

try {
    $propertyResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/properties" -Method POST -Headers @{
        "Content-Type"  = "application/json"
        "Authorization" = "Bearer $ownerToken"
    } -Body $propertyData
    
    if ($propertyResponse.success) {
        Write-Host "[OK] Property created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Created Property:" -ForegroundColor Cyan
        Write-Host "  ID          : $($propertyResponse.data.id)" -ForegroundColor White
        Write-Host "  Title       : $($propertyResponse.data.title)" -ForegroundColor White
        Write-Host "  Rent/Day    : ₹$($propertyResponse.data.rent_per_day)" -ForegroundColor White
        Write-Host "  Location    : $($propertyResponse.data.location)" -ForegroundColor White
        Write-Host "  Owner ID    : $($propertyResponse.data.owner_id)" -ForegroundColor White
        Write-Host "  Created At  : $($propertyResponse.data.created_at)" -ForegroundColor White
        Write-Host ""
        Write-Host "Full Response:" -ForegroundColor Gray
        $propertyResponse | ConvertTo-Json -Depth 3
    } else {
        Write-Host "[FAIL] Property creation failed" -ForegroundColor Red
        $propertyResponse | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "[ERROR] Property creation request failed" -ForegroundColor Red
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
Write-Host "TIP: You can modify the property data in the script" -ForegroundColor Yellow
Write-Host "     Required fields: title, rent_per_day, location" -ForegroundColor Yellow
Write-Host "     Optional fields: property_description, amenities, photo1-4 (base64)" -ForegroundColor Yellow
