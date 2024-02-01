FROM ubuntu:latest

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json /app/

# Install application dependencies
RUN npm install

# Install necessary packages
RUN apt-get update && apt-get install -y \
    libvpx6 \
    libevent-2.1-7 \
    libopus0 \
    libfontconfig1 \
    libfreetype6 \
    libharfbuzz-icu0 \
    libgstreamer1.0-0 \
    libgstreamer-plugins-base1.0-0 \
    libjpeg8 \
    libpng16-16 \
    libopenjp2-7 \
    libwebp6 \
    libenchant-2-2 \
    libsecret-1-0 \
    libhyphen0 \
    libx11-6 \
    libmanette-0.2-0 \
    libflite1 \
    libgbm1 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libgles2 \
    libx264-152 \
    && rm -rf /var/lib/apt/lists/*

# Copy your application files
COPY . /app

# Replace "/app/index.js" with the actual path in your application
CMD ["node", "/app/index.js"]