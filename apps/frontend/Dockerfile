# apps/frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

WORKDIR /app/apps/frontend

RUN npm install
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/frontend/.next .next
COPY --from=builder /app/apps/frontend/public public
COPY --from=builder /app/apps/frontend/package.json .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npx", "next", "start"]
