#Dockerfile

FROM node:18 AS build

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# PROD stage
FROM node:18

WORKDIR /usr/app

COPY --from=build /usr/app/dist ./dist

COPY package*.json ./

COPY /src/views ./src/views

COPY /src/public ./src/public

COPY production.env ./.env

RUN npm install

RUN rm package*.json

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
