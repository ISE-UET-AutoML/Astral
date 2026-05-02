# Stage 1: base — dependency manifest layer for cache reuse
# ----------------------------------------------------------------
FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./


# Stage 2: development — Vite dev server + named volume for node_modules
# ----------------------------------------------------------------
FROM base AS development

COPY docker-entrypoint-dev.sh /docker-entrypoint-dev.sh
RUN chmod +x /docker-entrypoint-dev.sh

# Install all deps (including devDependencies: vite, typescript, @vitejs/plugin-react, …)
RUN npm ci

COPY . .

ENTRYPOINT ["/docker-entrypoint-dev.sh"]
CMD []


# Stage 3: builder — static assets for production (Vite outputs to dist/)
# ----------------------------------------------------------------
FROM base AS builder

RUN npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_LABEL_STUDIO_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_LABEL_STUDIO_URL=$VITE_LABEL_STUDIO_URL

RUN npm run build


# Stage 4: production — nginx serves dist/
# ----------------------------------------------------------------
FROM nginx:1.27-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
