param (
  [string]$env = "local"
)

Write-Host "🌐 Switching to '$env' environment..."

# Load corresponding .env file
$envFilePath = ".env.$env"
if (Test-Path $envFilePath) {
  Copy-Item $envFilePath ".env" -Force
  Write-Host "✅ Loaded environment from $envFilePath"
} else {
  Write-Host "⚠️ Could not find $envFilePath. Using default .env"
}

# Generate Prisma client
Write-Host "`n> Generating Prisma Client..."
npm run generate

# Optional: Run seed only for local env
if ($env -eq "local") {
  Write-Host "`n🔄 Seeding database (local only)..."

  try {
    npm run seed
    Write-Host "✅ Seed completed"
  } catch {
    Write-Host "❌ Seed failed: $($_.Exception.Message)"
  }
}

# Start backend
Write-Host "`n🚀 Starting NestJS backend..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd apps/backend; npm run start:dev'

# Start frontend
Write-Host "`n🖼️ Starting Next.js frontend..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd apps/frontend; npm run dev'