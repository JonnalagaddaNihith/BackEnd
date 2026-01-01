# ============================================================
# API Testing Script for Online House Rental & Tenant Management
# ============================================================

$baseUrl = "http://localhost:3000/api"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "🏠 Online House Rental & Tenant Management System - API Tests" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host ""

# ------------------------------------------------------------
# Test 1: Health Check
# ------------------------------------------------------------
Write-Host "📡 Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health Check Passed" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
}
catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}
Write-Host ""

# ------------------------------------------------------------
# Test 2: Base API Info
# ------------------------------------------------------------
Write-Host "📡 Test 2: Base API Info" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/" -Method GET
    Write-Host "✅ Base API Info Retrieved" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
}
catch {
    Write-Host "❌ Base API Failed: $_" -ForegroundColor Red
}
Write-Host ""

# ------------------------------------------------------------
# Test 3: Register Tenant
# ------------------------------------------------------------
Write-Host "📡 Test 3: Register Tenant User" -ForegroundColor Yellow
$registerTenant = @{
    name     = "John Doe"
    email    = "john.tenant@example.com"
    password = "SecurePass123!"
    role     = "tenant"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerTenant -Headers $headers
    Write-Host "✅ Tenant Registration Successful" -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Tenant Registration Skipped / Exists" -ForegroundColor Yellow
}
Write-Host ""

# ------------------------------------------------------------
# Test 4: Register Owner
# ------------------------------------------------------------
Write-Host "📡 Test 4: Register Owner User" -ForegroundColor Yellow
$registerOwner = @{
    name     = "Jane Smith"
    email    = "jane.owner@example.com"
    password = "SecurePass456!"
    role     = "owner"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerOwner -Headers $headers
    Write-Host "✅ Owner Registration Successful" -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Owner Registration Skipped / Exists" -ForegroundColor Yellow
}
Write-Host ""

# ------------------------------------------------------------
# Test 5: Login Tenant
# ------------------------------------------------------------
Write-Host "📡 Test 5: Login as Tenant" -ForegroundColor Yellow
$tenantToken = ""

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body (@{
        email    = "john.tenant@example.com"
        password = "SecurePass123!"
    } | ConvertTo-Json) -Headers $headers

    $tenantToken = $response.data.token
    Write-Host "✅ Tenant Login Successful" -ForegroundColor Green
}
catch {
    Write-Host "❌ Tenant Login Failed" -ForegroundColor Red
}
Write-Host ""

# ------------------------------------------------------------
# Test 6: Login Owner
# ------------------------------------------------------------
Write-Host "📡 Test 6: Login as Owner" -ForegroundColor Yellow
$ownerToken = ""

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body (@{
        email    = "jane.owner@example.com"
        password = "SecurePass456!"
    } | ConvertTo-Json) -Headers $headers

    $ownerToken = $response.data.token
    Write-Host "✅ Owner Login Successful" -ForegroundColor Green
}
catch {
    Write-Host "❌ Owner Login Failed" -ForegroundColor Red
}
Write-Host ""

# ------------------------------------------------------------
# Test 7: Tenant Profile
# ------------------------------------------------------------
Write-Host "📡 Test 7: Get Tenant Profile" -ForegroundColor Yellow

if ($tenantToken) {
    try {
        Invoke-RestMethod -Uri "$baseUrl/users/profile" -Method GET -Headers @{
            "Content-Type"  = "application/json"
            "Authorization" = "Bearer $tenantToken"
        }
        Write-Host "✅ Tenant Profile Retrieved" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Tenant Profile Failed" -ForegroundColor Red
    }
}
else {
    Write-Host "⚠️ Skipped - No Tenant Token" -ForegroundColor Yellow
}
Write-Host ""

# ------------------------------------------------------------
# Test 8: Create Property
# ------------------------------------------------------------
Write-Host "📡 Test 8: Create Property" -ForegroundColor Yellow
$propertyId = 0

if ($ownerToken) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/properties" -Method POST -Headers @{
            "Content-Type"  = "application/json"
            "Authorization" = "Bearer $ownerToken"
        } -Body (@{
            title       = "2BHK Apartment"
            city        = "Mumbai"
            state       = "MH"
            price       = 25000
            bedrooms    = 2
            bathrooms   = 2
            status      = "available"
        } | ConvertTo-Json)

        $propertyId = $response.data.id
        Write-Host "✅ Property Created (ID: $propertyId)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Property Creation Failed" -ForegroundColor Red
    }
}
else {
    Write-Host "⚠️ Skipped - No Owner Token" -ForegroundColor Yellow
}
Write-Host ""

# ------------------------------------------------------------
# Test 9: Create Booking
# ------------------------------------------------------------
Write-Host "📡 Test 9: Create Booking" -ForegroundColor Yellow
$bookingId = 0

if ($tenantToken -and $propertyId -gt 0) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/bookings" -Method POST -Headers @{
            "Content-Type"  = "application/json"
            "Authorization" = "Bearer $tenantToken"
        } -Body (@{
            property_id = $propertyId
            start_date = "2025-01-15"
            end_date   = "2025-07-15"
        } | ConvertTo-Json)

        $bookingId = $response.data.id
        Write-Host "✅ Booking Created (ID: $bookingId)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Booking Failed" -ForegroundColor Red
    }
}
else {
    Write-Host "⚠️ Skipped - Missing Tenant or Property" -ForegroundColor Yellow
}
Write-Host ""

# ------------------------------------------------------------
# SUMMARY
# ------------------------------------------------------------
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "📝 SUMMARY" -ForegroundColor Cyan

$tenantStatus   = if ($tenantToken) { "✅" } else { "❌" }
$ownerStatus    = if ($ownerToken) { "✅" } else { "❌" }
$propertyStatus = if ($propertyId -gt 0) { "✅" } else { "❌" }
$bookingStatus  = if ($bookingId -gt 0) { "✅" } else { "❌" }

Write-Host "Tenant Login    : $tenantStatus"
Write-Host "Owner Login     : $ownerStatus"
Write-Host "Property Created: $propertyStatus"
Write-Host "Booking Created : $bookingStatus"

Write-Host ""
Write-Host "✅ API Testing Complete!" -ForegroundColor Green
