# Quick test - check what user "nihit@gmail.com" role is
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body '{"email":"nihitowner@gmail.com","password":"SecurePass123!"}' -Headers @{"Content-Type"="application/json"}
Write-Host "User: $($response.data.user.name)"
Write-Host "Role: $($response.data.user.role)"
Write-Host "ID: $($response.data.user.id)"

# Check if this user owns any properties
$token = $response.data.token
$bookings = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/owner/me" -Method GET -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"}
Write-Host "Bookings for properties owned: $($bookings.data.Count)"
