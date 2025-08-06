# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Fix registry timeout issue
RUN npm config set registry https://registry.npmmirror.com

COPY apps/backend/package*.json ./
RUN npm install --omit=dev


COPY apps/backend ./
COPY prisma ./prisma  # keep prisma path inside /app/prisma
ENV NODE_ENV=production
RUN npx prisma generate && npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app .

CMD ["node", "dist/main.js"]
