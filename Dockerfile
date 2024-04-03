FROM oven/bun:1.0.26 as build

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY src ./
COPY angular.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./

RUN bun run build

FROM nginx:stable-alpine-slim as production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80