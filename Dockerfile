FROM node:20-alpine

WORKDIR /apps
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .
RUN npm run build

RUN rm -rf src tsconfig.json
RUN mkdir logs
RUN mkdir assets

EXPOSE 12318
CMD [ "npm","start" ]