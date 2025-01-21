param([string]$url)
Write-Output "Preparing the image..."

docker build -t sgauravdev/portfolio-builder-backend:latest .
docker push sgauravdev/portfolio-builder-backend:latest

$secret = Read-Host "Enter password" -AsSecureString
Write-Output "Deploying the app, please wait..."
$plainPwd = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
)

caprover deploy -h "$url" -p "$plainPwd" -i sgauravdev/portfolio-builder-backend --appName "portfolio-backend"