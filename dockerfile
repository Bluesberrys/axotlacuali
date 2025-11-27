# Use official Node 20 image
FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install deps
RUN npm install --production

# Copy everything else
COPY . .

# Expose port used by the app
EXPOSE 5900

# Start the server
CMD ["node", "server.js"]
