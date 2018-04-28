FROM node:10.0.0-alpine
ENV PORT=80
EXPOSE 80

WORKDIR /var/www/html

COPY package*.json ./

RUN apk add --no-cache nginx
COPY . .
#RUN npm rebuild node-sass --force
#RUN npm run build
COPY dockerConfig/nginx.conf /etc/nginx/nginx.conf


CMD ["nginx", "-g", "daemon off;"]
