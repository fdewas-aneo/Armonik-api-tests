FROM node:lts-slim as build

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile 

COPY src ./src
COPY tsconfig.json tsconfig.app.json ./
COPY angular.json ./

RUN pnpm run build

FROM nginx:stable-alpine-slim as production

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80