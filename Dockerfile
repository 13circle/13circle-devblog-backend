FROM node:fermium-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]

