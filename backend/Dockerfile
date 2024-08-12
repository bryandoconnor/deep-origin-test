# Backend Dockerfile

# Set the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY backend .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3001

# Start the application
CMD ["node", "dist/server.js"]