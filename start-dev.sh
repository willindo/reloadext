#!/bin/bash
echo "🔄 Starting Next.js + NestJS Dev Servers..."
cd apps/frontend && npm run dev &
cd apps/backend && npm run dev &
wait
