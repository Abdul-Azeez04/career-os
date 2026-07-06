$maxRetries = 15
$retryInterval = 10

for ($i = 0; $i -lt $maxRetries; $i++) {
    git push origin master
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Push successful!"
        break
    } else {
        Write-Host "Push failed. Retrying in $retryInterval seconds... ($($i+1)/$maxRetries)"
        Start-Sleep -Seconds $retryInterval
    }
}
