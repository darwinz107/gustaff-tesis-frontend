# ETAPA 1: Construcción (Build)
FROM node:20-alpine AS build-step
WORKDIR /guss-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ETAPA 2: Servidor de producción (Nginx)
FROM nginx:alpine
# Copiamos los archivos que generó React (usualmente en la carpeta /dist o /build)

COPY --from=build-step /guss-app/dist /usr/share/nginx/html

# Exponemos el puerto 80 (estándar web)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]