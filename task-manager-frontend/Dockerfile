# Build Stage
FROM node:18 AS build-stage
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build -- --configuration production

# Production Stage
FROM nginx:alpine AS production-stage
WORKDIR /usr/share/nginx/html
COPY --from=build-stage /app/dist/task-manager-frontend ./
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
