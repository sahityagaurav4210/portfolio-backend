Write-Output "Preparing the image..."

docker build -t sgauravdev/portfolio-builder-backend:latest .
docker push sgauravdev/portfolio-builder-backend:latest

Write-Output "Deploying the app, please wait..."

param([string]$host, [string]$pwd)
caprover-deploy.cmd -h "$host" -p "$pwd" -i sgauravdev/portfolio-builder-backend --appName "portfolio-backend"