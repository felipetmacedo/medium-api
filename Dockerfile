FROM node:14.17.0-alpine
WORKDIR /app

ARG BUGSNAG_KEY
ENV BUGSNAG_KEY=${BUGSNAG_KEY}

RUN apk add chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]
