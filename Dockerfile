#Dockerfile

FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ENV NODE_ENV production

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
