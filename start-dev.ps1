# start-dev.ps1
# Automatic dev mode starter for reload-ops

# Detect WSL presence
function Test-WSL {
    return (Get-Command wsl.exe -ErrorAction SilentlyContinue) -ne $null
}

# Determine mode: docker if WSL detected, else local
$mode = if (Test-WSL) { "docker" } else { "local" }

Write-Host "=== reload-ops Dev Starter ==="
Write-Host "Detected mode: $mode"

# Always call switch-env.sh (safe overwrite logic is inside)
if (Test-Path "./switch-env.sh") {
    if (Test-WSL) {
        # Run inside WSL for consistent env handling
        wsl bash ./switch-env.sh $mode
    } else {
        bash ./switch-env.sh $mode
    }
} else {
    Write-Host "⚠ switch-env.sh not found, skipping env switch"
}

# Read database connection info from .env
$envFile = Get-Content ".env"
$dbHost = ($envFile | Where-Object { $_ -match "^DB_HOST=" }) -replace "DB_HOST=", ""
$dbPort = ($envFile | Where-Object { $_ -match "^DB_PORT=" }) -replace "DB_PORT=", ""

# Wait for DB function
function Wait-For-DB {
    param (
        [string]$Host,
        [int]$Port,
        [int]$Retries = 15,
        [int]$Delay = 2
    )
    for ($i = 0; $i -lt $Retries; $i++) {
        if (Test-NetConnection -ComputerName $Host -Port $Port -InformationLevel Quiet) {
            return $true
        }
        Start-Sleep -Seconds $Delay
    }
    return $false
}

# If docker mode, ensure DB is running
if ($mode -eq "docker") {
    Write-Host "Starting Docker services..."
    docker-compose up -d db pgadmin
    "Waiting for database (${dbHost}:${dbPort})..."

    if (-not (Wait-For-DB -Host $dbHost -Port $dbPort)) {
        Write-Host "❌ Could not connect to database after starting it. Exiting."
        exit 1
    }
}

# Start backend and frontend in separate PowerShell windows
Write-Host "Starting backend..."
Start-Process powershell -ArgumentList "cd apps/backend; npm run start:dev"

Write-Host "Starting frontend..."
Start-Process powershell -ArgumentList "cd apps/frontend; npm run dev"
