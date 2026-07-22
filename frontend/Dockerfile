# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Serve Stage ----------
FROM nginx:alpine

# Copy built assets to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx template (env vars substituted at startup)
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

# nginx:alpine automatically processes templates in /etc/nginx/templates/
# using envsubst and places them in /etc/nginx/conf.d/
# Environment variables: BACKEND_URL, ML_API_URL

CMD ["nginx", "-g", "daemon off;"]
