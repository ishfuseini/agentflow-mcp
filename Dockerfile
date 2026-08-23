# --- build stage
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# --- runtime stage
FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV MCP_TRANSPORT=http-stream
ENV PORT=8080

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY data/ ./data/

EXPOSE 8080
CMD ["node", "dist/index.js"]
