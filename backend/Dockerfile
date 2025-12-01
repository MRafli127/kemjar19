# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create required directories
RUN mkdir -p uploads logs

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
