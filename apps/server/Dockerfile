# -------------------------
# 1️⃣ Build stage
# -------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Kopieer root package files
COPY package.json package-lock.json ./

# Kopieer scriptmappen en package.json’s
COPY ../../scripts scripts
COPY ../../packages/core/package.json packages/core/package.json
COPY ../../packages/crdt/package.json packages/crdt/package.json
COPY ../../apps/server/package.json apps/server/package.json
COPY ../../tsconfig.base.json ./

# Installeer dependencies
RUN npm ci

# Kopieer de volledige broncode
COPY ../../packages/core packages/core
COPY ../../packages/crdt packages/crdt
COPY ../../apps/server apps/server

# Build alle packages
RUN npm run build -w @colanode/core && \
    npm run build -w @colanode/crdt && \
    npm run build -w @colanode/server

# -------------------------
# 2️⃣ Runtime stage
# -------------------------
FROM node:22-alpine

WORKDIR /app

# Alleen de dist en productiepackages meenemen
COPY --from=builder /app/apps/server/dist apps/server/dist
COPY --from=builder /app/apps/server/package.json apps/server/package.json
COPY --from=builder /app/package.json /app/package-lock.json ./

# Productie-installatie
RUN npm ci --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

# Stripe gebruikt PORT, Render ook → goed zo
CMD ["node", "apps/server/dist/index.js"]
