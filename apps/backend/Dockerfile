# apps/backend/Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY . .

WORKDIR /app/apps/backend

RUN npm install
RUN npm run build

ENV NODE_ENV=production

CMD ["node", "dist/main"]
