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