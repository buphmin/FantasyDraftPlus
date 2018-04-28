FROM node:carbon-alpine
WORKDIR /var/www/html
RUN npm i -g @adonisjs/cli
COPY package*.json ./

COPY . .
EXPOSE 3333
CMD [ "adonis", "serve" ]