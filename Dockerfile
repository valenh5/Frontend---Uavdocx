FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

FROM httpd:alpine

WORKDIR /usr/local/apache2/htdocs/

# copiamos SOLO la carpeta correcta del build de Angular
COPY --from=build /app/dist/frontend/browser/ ./

# copiamos la config de apache
COPY apache.conf /usr/local/apache2/conf/extra/angular.conf
RUN echo "Include conf/extra/angular.conf" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80
CMD ["httpd-foreground"]
