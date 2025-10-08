FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../prisma/schema.prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
