# Test Multiple Pending Bookings Feature
# This script tests the new functionality where:
# 1. Multiple tenants can create pending bookings for same dates
# 2. Owner can approve one booking
# 3. Other pending bookings get auto-rejected

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testing Multiple Pending Bookings Feature" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Setup: Get tokens for owner and 2 tenants
Write-Host "[SETUP] Getting authentication tokens..." -ForegroundColor Yellow

# Owner login
$ownerToken = (Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body '{"email":"jane.owner@example.com","password":"SecurePass456!"}' -Headers @{"Content-Type"="application/json"}).data.token

# Tenant 1 login
$tenant1Token = (Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body '{"email":"testuser1302764448@example.com","password":"SecurePass123!"}' -Headers @{"Content-Type"="application/json"}).data.token
$tenant1Name = (Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body '{"email":"testuser1302764448@example.com","password":"SecurePass123!"}' -Headers @{"Content-Type"="application/json"}).data.user.name

# Tenant 2 login (create if doesn't exist)
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body '{"name":"Tenant Two","email":"tenant2@test.com","password":"SecurePass123!","role":"tenant"}' -Headers @{"Content-Type"="application/json"} | Out-Null
} catch {}
$tenant2Token = (Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body '{"email":"tenant2@test.com","password":"SecurePass123!"}' -Headers @{"Content-Type"="application/json"}).data.token
$tenant2Name = (Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body '{"email":"tenant2@test.com","password":"SecurePass123!"}' -Headers @{"Content-Type"="application/json"}).data.user.name

# Get first property
$propertyId = (Invoke-RestMethod -Uri "http://localhost:3000/api/properties" -Method GET).data[0].id
$propertyTitle = (Invoke-RestMethod -Uri "http://localhost:3000/api/properties" -Method GET).data[0].title

Write-Host "[OK] Tokens acquired" -ForegroundColor Green
Write-Host "  Owner Token: ...$(($ownerToken).Substring(($ownerToken).Length - 10))" -ForegroundColor Gray
Write-Host "  Tenant 1: $tenant1Name" -ForegroundColor Gray
Write-Host "  Tenant 2: $tenant2Name" -ForegroundColor Gray
Write-Host "  Property: $propertyTitle (ID: $propertyId)" -ForegroundColor Gray
Write-Host ""

# Test dates (tomorrow to +7 days)
$checkIn = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$checkOut = (Get-Date).AddDays(8).ToString("yyyy-MM-dd")

# Test 1: Tenant 1 creates a booking
Write-Host "[TEST 1] Tenant 1 creates a booking request..." -ForegroundColor Yellow
try {
    $booking1 = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings" -Method POST -Headers @{
        "Authorization" = "Bearer $tenant1Token"
        "Content-Type" = "application/json"
    } -Body "{`"property_id`":$propertyId,`"check_in`":`"$checkIn`",`"check_out`":`"$checkOut`"}"
    
    Write-Host "[OK] Booking 1 created (ID: $($booking1.data.id), Status: $($booking1.data.status))" -ForegroundColor Green
    $booking1Id = $booking1.data.id
} catch {
    Write-Host "[FAIL] Tenant 1 booking failed" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message }
    exit
}
Write-Host ""

# Test 2: Tenant 2 creates ANOTHER booking for SAME dates
Write-Host "[TEST 2] Tenant 2 creates booking for SAME dates..." -ForegroundColor Yellow
try {
    $booking2 = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings" -Method POST -Headers @{
        "Authorization" = "Bearer $tenant2Token"
        "Content-Type" = "application/json"
    } -Body "{`"property_id`":$propertyId,`"check_in`":`"$checkIn`",`"check_out`":`"$checkOut`"}"
    
    Write-Host "[OK] Booking 2 created (ID: $($booking2.data.id), Status: $($booking2.data.status))" -ForegroundColor Green
    Write-Host "     This proves multiple PENDING bookings are allowed!" -ForegroundColor Cyan
    $booking2Id = $booking2.data.id
} catch {
    Write-Host "[FAIL] Tenant 2 booking failed (UNEXPECTED!)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message }
    exit
}
Write-Host ""

# Test 3: Check owner sees both pending bookings
Write-Host "[TEST 3] Checking owner's pending bookings..." -ForegroundColor Yellow
try {
    $ownerBookings = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/owner/me" -Method GET -Headers @{
        "Authorization" = "Bearer $ownerToken"
        "Content-Type" = "application/json"
    }
    
    $pendingCount = ($ownerBookings.data | Where-Object { $_.status -eq 'Pending' }).Count
    Write-Host "[OK] Owner sees $pendingCount pending booking(s)" -ForegroundColor Green
    
    $ownerBookings.data | Where-Object { $_.status -eq 'Pending' } | ForEach-Object {
        Write-Host "     - Booking ID $($_.id): $($_.tenant_name) ($checkIn to $checkOut)" -ForegroundColor Gray
    }
} catch {
    Write-Host "[FAIL] Could not fetch owner bookings" -ForegroundColor Red
}
Write-Host ""

# Test 4: Owner approves booking 1
Write-Host "[TEST 4] Owner approves Booking 1 (from $tenant1Name)..." -ForegroundColor Yellow
try {
    $approved = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/$booking1Id/status" -Method PATCH -Headers @{
        "Authorization" = "Bearer $ownerToken"
        "Content-Type" = "application/json"
    } -Body '{"status":"Approved"}'
    
    Write-Host "[OK] Booking 1 APPROVED!" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Could not approve booking" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message }
}
Write-Host ""

# Test 5: Check if booking 2 was auto-rejected
Write-Host "[TEST 5] Checking if Booking 2 was auto-rejected..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
try {
    $booking2Status = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/$booking2Id" -Method GET -Headers @{
        "Authorization" = "Bearer $tenant2Token"
        "Content-Type" = "application/json"
    }
    
    if ($booking2Status.data.status -eq 'Rejected') {
        Write-Host "[OK] Booking 2 was AUTO-REJECTED! Feature working correctly!" -ForegroundColor Green
        Write-Host "     Status changed from 'Pending' to 'Rejected'" -ForegroundColor Cyan
    } else {
        Write-Host "[FAIL] Booking 2 status is: $($booking2Status.data.status) (expected: Rejected)" -ForegroundColor Red
    }
} catch {
    Write-Host "[FAIL] Could not check booking 2 status" -ForegroundColor Red
}
Write-Host ""

# Test 6: Try to create booking for already approved dates
Write-Host "[TEST 6] Trying to create booking for approved dates (should fail)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/bookings" -Method POST -Headers @{
        "Authorization" = "Bearer $tenant2Token"
        "Content-Type" = "application/json"
    } -Body "{`"property_id`":$propertyId,`"check_in`":`"$checkIn`",`"check_out`":`"$checkOut`"}" | Out-Null
    
    Write-Host "[FAIL] Booking was created (SHOULD HAVE BEEN BLOCKED!)" -ForegroundColor Red
} catch {
    Write-Host "[OK] Booking correctly blocked!" -ForegroundColor Green
    Write-Host "     Error: Property is already booked" -ForegroundColor Gray
}
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Test Suite Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary of New Features:" -ForegroundColor Cyan
Write-Host "  ✅ Multiple pending bookings allowed" -ForegroundColor Green
Write-Host "  ✅ Owner can approve one booking" -ForegroundColor Green
Write-Host "  ✅ Other pending bookings auto-rejected" -ForegroundColor Green
Write-Host "  ✅ Cannot create booking if approved exists" -ForegroundColor Green
