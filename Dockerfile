FROM oven/bun:canary-slim as build

COPY ./package.json ./
COPY ./bun.lockb ./

RUN bun i --frozen-lockfile

COPY src ./src
COPY tsconfig.json tsconfig.app.json ./
COPY angular.json ./

RUN bun run build

FROM nginx:stable-alpine-slim as production

COPY --from=build /dist /usr/share/nginx/html

EXPOSE 80