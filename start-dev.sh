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
on vercel :
NEXT_PUBLIC_API_URL=https://reload-ops-production.up.railway.app
NEXTAUTH_URL=https://reload-ops.vercel.app
NEXTAUTH_SECRET=supersecretkey
on railway
FRONTEND_URL=https://reload-ops.vercel.app
DATABASE_URL=postgresql://postgres:tAHUmyfaoIuzbGCjiPYPPROaLEgfcjeA@postgres.railway.internal:5432/railway
JWT_SECRET=supersecretkey
NODE_ENV=production
/backend =>
--- datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}---
app.enableCors({
  origin: [ process.env.FRONTEND_URL ,'http://localhost:3000'],
  credentials: true,
});

  await app.listen(port,'0.0.0.0');
  console.log(`🚀 Server is running on http://0.0.0.0:${port}`);
}---
  super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'supersecretkey',
    });
  }---
   JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: '1d' },
    }),---
/frontend =>
  const res = await fetch("https://reload-ops-production.up.railway.app/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },---
   const api = axios.create({
  // baseURL: "http://localhost:3001",
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});         
 verify all above, remove or add on vercel or railway? these all about env variables setup . 
i provide here railway.json = {
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
      "dockerfilePath": null,
    "nixpacksPlan": {
      "providers": ["node"],
      "phases": {
        "install": {
          "cmds": ["npm install --legacy-peer-deps"]
        },
        "build": {
          "cmds": ["npm run build"]
        }
      },
      "startCommand": "npm run start:prod"
    }
  },
  "deploy": {
    "preDeployCommand": ["npx prisma migrate deploy"]
  }
}
