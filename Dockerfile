# Use a base image with Node.js and necessary system libraries
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install Playwright with Webkit
RUN npx playwright install-deps webkit

RUN npx playwright install webkit

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Expose any required ports
# EXPOSE 3000

# Command to start the application
CMD ["node", "index.js"]