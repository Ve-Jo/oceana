FROM oven/bun:1 as base
WORKDIR /app
COPY package*.json ./
RUN bun i
COPY . .
CMD ["bun", "."]