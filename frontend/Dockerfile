# Frontend Dockerfile

# Set the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY frontend .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]