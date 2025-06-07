FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --prod


RUN ls -la /app/dist

FROM httpd:alpine

WORKDIR /usr/local/apache2/htdocs/

COPY --from=build /app/dist/* /usr/local/apache2/htdocs/

RUN ls -la /usr/local/apache2/htdocs/  # Debug: listar contenido final

RUN [ -d browser ] && mv browser/* . && rmdir browser || echo "No hay archivos en browser/"

EXPOSE 80

CMD ["httpd-foreground"]
