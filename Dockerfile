# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx template para SPA + proxy /api (envsubst en startup)
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.d/10-require-backend-url.sh /docker-entrypoint.d/10-require-backend-url.sh
RUN chmod +x /docker-entrypoint.d/10-require-backend-url.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
