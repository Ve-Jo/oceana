FROM ubuntu:latest

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    libgstreamer1.0-0 \
    libatomic1 \
    libxslt1.1 \
    libvpx7 \
    libevent-2.1-7 \
    libopus0 \
    libharfbuzz-icu0 \
    libgstreamer-plugins-base1.0-0 \
    libopenjp2-7 \
    libwebpdemux2 \
    libenchant-2-2 \
    libsecret-1-0 \
    libhyphen0 \
    libmanette-0.2-0 \
    libflite1 \
    libgles2 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy your application files
COPY . /app

# Replace "node index.js" with the appropriate command to start your application
CMD ["node", "index.js"]