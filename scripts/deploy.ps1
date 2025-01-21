param([string]$url, [string]$code)
Write-Output "Preparing the image..."

docker build -t sgauravdev/portfolio-builder-backend:latest .
docker push sgauravdev/portfolio-builder-backend:latest

Write-Output "Deploying the app, please wait..."

caprover deploy -h "$url" -p "$code" -i sgauravdev/portfolio-builder-backend --appName "portfolio-backend"