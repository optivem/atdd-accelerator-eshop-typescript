# Stage 1: Build the app
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Run the app
FROM node:22-alpine
WORKDIR /app

# Copy built files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/public ./src/public

# Install production dependencies only
RUN npm ci --only=production

# Expose port
EXPOSE 8080

# Start the app
CMD ["node", "dist/main.js"]