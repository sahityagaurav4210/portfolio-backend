FROM node:20 AS source

WORKDIR /build
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .
RUN npm run build

FROM node:22.12.0-alpine3.21 AS build

COPY --from=source /build/node_modules /apps/node_modules
COPY --from=source /build/build /apps/apps
COPY --from=source /build/uploads /apps/uploads
COPY --from=source /build/captain-definition /apps/captain-definition
COPY --from=source /build/package.json /apps/package.json
COPY --from=source /build/package-lock.json /apps/package-lock.json

WORKDIR /apps

EXPOSE 12318
CMD [ "npm","start" ]