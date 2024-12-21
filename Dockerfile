FROM node:20 AS source

RUN mkdir -p /build

WORKDIR /build
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .
RUN npm run build

FROM node:22.12.0-alpine3.21 AS build

RUN mkdir -p /apps

COPY --from=source /build/node_modules /apps/node_modules
COPY --from=source /build/build /apps/build
COPY --from=source /build/uploads /apps/uploads
COPY --from=source /build/captain-definition /apps/captain-definition
COPY --from=source /build/package.json /apps/package.json
COPY --from=source /build/package-lock.json /apps/package-lock.json

WORKDIR /apps

ARG PORT=12318
ARG HOST=${HOST}
ARG ACCEPTED_CLIENTS=${ACCEPTED_CLIENTS}
ARG DATABASE_CONN_STRING=${DATABASE_CONN_STRING}
ARG DATABASE_NAME=${DATABASE_NAME}
ARG ACCESS_TOKEN_EXP=${ACCESS_TOKEN_EXP}
ARG REF_TOKEN_EXP=${REF_TOKEN_EXP}
ARG ACCESS_TOKEN_SEC=${ACCESS_TOKEN_SEC}
ARG REFRESH_TOKEN_SEC=${REFRESH_TOKEN_SEC}
ARG X_API_EXP=${X_API_EXP}
ARG X_API_SEC=${X_API_SEC}
ARG PASSPHRASE=${PASSPHRASE}
ARG SALT=${SALT}
ARG CV_URL=${CV_URL}
ARG PHOTO_URL=${PHOTO_URL}

ENV PORT=12318
ENV HOST=${HOST}
ENV ACCEPTED_CLIENTS=${ACCEPTED_CLIENTS}
ENV DATABASE_CONN_STRING=${DATABASE_CONN_STRING}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV ACCESS_TOKEN_EXP=${ACCESS_TOKEN_EXP}
ENV REF_TOKEN_EXP=${REF_TOKEN_EXP}
ENV ACCESS_TOKEN_SEC=${ACCESS_TOKEN_SEC}
ENV X_API_EXP=${X_API_EXP}
ENV X_API_SEC=${X_API_SEC}
ENV PASSPHRASE=${PASSPHRASE}
ENV SALT=${SALT}
ENV CV_URL=${CV_URL}
ENV PHOTO_URL=${PHOTO_URL}


EXPOSE 12318
CMD [ "npm","start" ]