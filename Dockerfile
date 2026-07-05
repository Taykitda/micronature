# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the project (frontend + backend)
RUN npm run build

# Stage 2: Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set env to production
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory structure to ensure correct permissions
RUN mkdir -p public/uploads

# Expose app port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.cjs"]
