FROM node:20

RUN mkdir -p /usr/apps
WORKDIR /usr/apps
COPY package.json .
COPY tsconfig.json .
RUN npm install
RUN npm run build
COPY . .
ENV NODE_ENV=production
ENV PORT=12318
ENV HOST=0.0.0.0
ENV ACCEPTED_CLIENTS=*
ENV DATABASE_CONN_STRING=mongodb://root:mongo!2024@srv-captain--mongo:27017/
ENV DATABASE_NAME=portfolio_backend?authSource=admin&retryWrites=true&w=majority
ENV ACCESS_TOKEN_EXP=10m
ENV REF_TOKEN_EXP=5d
ENV ACCESS_TOKEN_SEC=$2a$10$WZBgT6edISy5dgH9KkyJCOeuq3tSEXj6.PeA7/r5CpT9sbZCMCTYO
ENV REFRESH_TOKEN_SEC=$2a$10$KvQEpOtCMweq1D2u4HrZ8OC.4GJKHRFcGFPiMTw.xhsxMAo8VVxvu
ENV X_API_EXP=28d
ENV X_API_SEC=!!xApi$$2024^^
ENV PASSPHRASE=33~~XpW!!99
ENV SALT=990~sALT!!66
EXPOSE 12318
CMD [ "npm","start" ]