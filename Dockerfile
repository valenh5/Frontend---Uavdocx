# Etapa 1: build de Angular
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Etapa 2: servidor Apache
FROM httpd:alpine

WORKDIR /usr/local/apache2/htdocs/

# 👇 Copiamos desde donde Angular genera el build (según tu angular.json)
COPY --from=build /app/dist/frontend/browser/ ./

# Configuración de Apache
COPY apache.conf /usr/local/apache2/conf/extra/angular.conf
RUN echo "Include conf/extra/angular.conf" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80
CMD ["httpd-foreground"]
