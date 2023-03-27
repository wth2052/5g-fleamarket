#Dockerfile

FROM node:18 AS build

WORKDIR /usr/app/

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# PROD stage
FROM node:18

WORKDIR /usr/app/

COPY --from=build /usr/app/dist ./dist

COPY /src/views ./src/views

COPY /src/public ./src/public

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
