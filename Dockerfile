# ---- base ----
FROM node:20-slim AS base
ENV NODE_ENV=production
WORKDIR /app

# ---- deps (production deps only) ----
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ---- build (if you had TS/build steps; safe for ESM JS too) ----
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .

# ---- runtime ----
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Run as non-root for security
RUN useradd -m nodeuser
USER nodeuser

# Copy runtime deps and app code
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app ./

ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
