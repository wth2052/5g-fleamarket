#Dockerfile

FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# PROD stage
FROM node:18
WORKDIR /usr/src/app
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
RUN rm package*.json
EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
