#!/bin/bash
echo "🔄 Switching to local environment and starting Next.js + NestJS Dev Servers..."

# Switch environment
./switch-env.sh local

# Generate Prisma client
npm run generate

# Seed the database
npm run seed

# Start frontend and backend dev servers
cd apps/frontend && npm run dev &
cd apps/backend && npm run start:dev &

wait
# find . -type f \( -name "products.controller.ts" -o -name "products.service.ts" -o -name "ProductForm.tsx" \) -exec cat {} +
# find . -type f \( -name "products.controller.ts" -o -name "products.service.ts" -o -name "ProductForm.tsx" \) -exec cat {} + | less
# find . -type f  \(  -name "api.ts" -o  -name "auth.ts" -o -name "[...nextauth].ts" -o  -name "login.tsx" -o -name "register.tsx" -o  -name "auth.controller.ts" -o  -name "auth.service.ts"  \) -exec sh -c 'for f; do echo "=== $f ==="; cat "$f"; done' sh {} +
# find . -type f \(  -name "api.ts" -o  -name "auth.ts" -o -name "[...nextauth].ts" -o  -name "login.tsx" -o -name "register.tsx" -o  -name "" -o  -name "auth.controller.ts" -o  -name "auth.service.ts"  \) -exec sh -c 'for f; do echo "=== $f ==="; cat "$f"; done' sh {} +
# find . -type f \( -name "index.tsx"  \) -exec sh -c 'for f; do echo "=== $f ==="; cat "$f"; done' sh {} +
#  \(  -name "api.ts" -o  -name "auth.ts" -o -name "[...nextauth].ts" -o  -name "login.tsx" -o -name "register.tsx" -o  -name "auth.controller.ts" -o  -name "auth.service.ts"  \)
#!/bin/bash

# Define your folders
# folders=(
#     "/mnt/c/Path/To/Folder1"
#     "/mnt/c/Path/To/Folder2"
#     "/mnt/d/Another/Folder"
# )

# Loop through each folder
# for folder in "${folders[@]}"; do
#     echo -e "\n=== Reading files from: $folder ===\n"
#     find "$folder" -type f -exec bash -c 'for f; do echo -e "\n----- $f -----"; cat "$f"; done' _ {} +
# done
# Define your folders
# $folders = @(
#     "C:\Path\To\Folder1",
#     "C:\Path\To\Folder2",
#     "D:\Another\Folder"
# )

# Loop through each folder
# foreach ($folder in $folders) {
#     Write-Host "`n=== Reading files from: $folder ===`n"
#     Get-ChildItem -Path $folder -Recurse -File | ForEach-Object {
#         Write-Host "`n----- $($_.FullName) -----"
#         Get-Content $_.FullName
#     }
# }
#  new-item -itemtype file  -name  "animation1.json", "animation2.json"," animation3.json"  -path  C:\Users\loki\lottie-office-demo\public  -force
# $files = @("animation1.json", "animation2.json", "animation3.json")
# $targetPath = "C:\Users\loki\lottie-office-demo\public"

# foreach ($file in $files) {
#     New-Item -ItemType File -Path (Join-Path $targetPath $file) -Force
# }
#  mkdir -p apps/backend/prisma
# cp prisma/schema.prisma apps/backend/prisma/schema.prisma