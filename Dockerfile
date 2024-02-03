FROM oven/bun:1 as base
WORKDIR /app
COPY package*.json ./
RUN bun i
RUN bunx playwright install-deps chromium
RUN bunx playwright install chromium
COPY . .
CMD ["bun", "."]