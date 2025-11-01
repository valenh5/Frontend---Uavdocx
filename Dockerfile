FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

FROM httpd:alpine

WORKDIR /usr/local/apache2/htdocs/

COPY --from=build /app/dist/frontend/browser/ ./

COPY apache.conf /usr/local/apache2/conf/httpd.conf

RUN ls -la /usr/local/apache2/conf/

EXPOSE 80

CMD ["httpd-foreground"]
