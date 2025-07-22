#!/bin/bash

echo "✅ Creating folder structure..."
mkdir -p apps/backend
mkdir -p prisma

echo "✅ Creating Prisma schema..."
cat > prisma/schema.prisma <<EOF
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  products  Product[]
  createdAt DateTime @default(now())
}

model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}
EOF

echo "✅ Creating .env file"
cat > .env <<EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/reload_db"
JWT_SECRET="supersecretkey"
EOF

echo "✅ Backend setup: installing dependencies"
cd apps/backend
npm init -y
npm install prisma @prisma/client

# Back to root to run prisma commands from where schema is available
cd ../..

echo "✅ Running prisma generate..."
npx prisma generate

echo "🟢 Ready. Next steps:"
echo "👉 cd apps/backend"
echo "👉 Add NestJS files (use next script or generate manually)"
