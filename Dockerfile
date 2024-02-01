# Use a base image with Node.js and necessary system libraries
FROM node:18

# Install necessary system libraries
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libxss1 \
    libgtk-3-0 \
    libxshmfence1 \
    libglu1 \
    libsoup2.4-1 \
    libgstreamer1.0-0 \
    libwoff1 \
    libvpx6 \
    libopus0 \
    libharfbuzz-icu0 \
    libgstallocators1.0-0 \
    libgstapp1.0-0 \
    libgstbase1.0-0 \
    libgstpbutils1.0-0 \
    libgstaudio1.0-0 \
    libgsttag1.0-0 \
    libgstvideo1.0-0 \
    libgstgl1.0-0 \
    libgstcodecparsers1.0-0 \
    libgstfft1.0-0 \
    libenchant-2-2 \
    libsecret-1-0 \
    libhyphen0 \
    libmanette-0.2-0 \
    libflite1 \
    libflite_usenglish1 \
    libflite_cmu_grapheme_lang1 \
    libflite_cmu_grapheme_lex1 \
    libflite_cmu_indic_lang1 \
    libflite_cmu_indic_lex1 \
    libflite_cmulex1 \
    libflite_cmu_time_awb1 \
    libflite_cmu_us_awb1 \
    libflite_cmu_us_kal16 \
    libflite_cmu_us_kal \
    libflite_cmu_us_rms \
    libflite_cmu_us_slt \
    libgles2 \
    libx264-152 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright with Webkit
RUN npx playwright install webkit

# Copy application files
COPY . .

# Expose any required ports
# EXPOSE 3000

# Command to start the application
CMD ["node", "index.js"]