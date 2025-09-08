# 生产运行阶段
FROM node:22-slim AS base

ARG USE_CN_MIRROR

ENV DEBIAN_FRONTEND="noninteractive"

RUN \
    # If you want to build docker in China, build with --build-arg USE_CN_MIRROR=true
    if [ "${USE_CN_MIRROR:-false}" = "true" ]; then \
        sed -i "s/deb.debian.org/mirrors.ustc.edu.cn/g" "/etc/apt/sources.list.d/debian.sources"; \
    fi \
    # Add required package
    && apt update \
    && apt install ca-certificates -qy \
    # Prepare required package to distroless
    && mkdir -p /distroless/bin /distroless/etc /distroless/etc/ssl/certs /distroless/lib \

    # Copy node to distroless
    && cp /usr/lib/$(arch)-linux-gnu/libstdc++.so.6 /distroless/lib/libstdc++.so.6 \
    && cp /usr/lib/$(arch)-linux-gnu/libgcc_s.so.1 /distroless/lib/libgcc_s.so.1 \
    && cp /usr/lib/$(arch)-linux-gnu/libdl.so.2 /distroless/lib/libdl.so.2 \
    && cp /usr/local/bin/node /distroless/bin/node \
    # Copy CA certificates to distroless
    && cp /etc/ssl/certs/ca-certificates.crt /distroless/etc/ssl/certs/ca-certificates.crt \
    # Cleanup temp files
    && rm -rf /tmp/* /var/lib/apt/lists/* /var/tmp/*

## Builder image, install all the dependencies and build the app
FROM base AS builder

ARG USE_CN_MIRROR

ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_OPENAPI_ENDPOINT
ARG NEXT_PUBLIC_LITELLM_URL
ARG NEXT_PUBLIC_OIDC_CLIENT_ID
ARG NEXT_PUBLIC_OIDC_ISSUER

# Node
ENV NODE_OPTIONS="--max-old-space-size=6144"

# Zephyr 环境变量
ENV NEXT_PUBLIC_APP_NAME="${NEXT_PUBLIC_APP_NAME:-保险客户管理系统}" \
    NEXT_PUBLIC_OPENAPI_ENDPOINT="${NEXT_PUBLIC_OPENAPI_ENDPOINT}" \
    NEXT_PUBLIC_LITELLM_URL="${NEXT_PUBLIC_LITELLM_URL}" \

# OIDC 环境变量
ENV NEXT_PUBLIC_OIDC_CLIENT_ID="${NEXT_PUBLIC_OIDC_CLIENT_ID:-zephyr}" \
    NEXT_PUBLIC_OIDC_ISSUER="${NEXT_PUBLIC_OIDC_ISSUER}"

WORKDIR /app

COPY package.json ./
COPY .npmrc ./

RUN \
    # If you want to build docker in China, build with --build-arg USE_CN_MIRROR=true
    if [ "${USE_CN_MIRROR:-false}" = "true" ]; then \
        export SENTRYCLI_CDNURL="https://npmmirror.com/mirrors/sentry-cli"; \
        npm config set registry "https://registry.npmmirror.com/"; \
        echo 'canvas_binary_host_mirror=https://npmmirror.com/mirrors/canvas' >> .npmrc; \
    fi \
    # Set the registry for corepack
    && export COREPACK_NPM_REGISTRY=$(npm config get registry | sed 's/\/$//') \
    # Update corepack to latest (nodejs/corepack#612)
    && npm i -g corepack@latest \
    # Enable corepack
    && corepack enable \
    # Use pnpm for corepack
    && corepack use $(sed -n 's/.*"packageManager": "\(.*\)".*/\1/p' package.json) \
    # Install the dependencies
    && pnpm i \
    # Add db migration dependencies
    && mkdir -p /deps \
    && cd /deps \
    && pnpm init \
    && pnpm add pg drizzle-orm

COPY . .

# run build standalone for docker version
RUN npm run build:docker

## Application image, copy all the files for production
FROM busybox:latest AS app

COPY --from=base /distroless/ /

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone /app/

# Copy database migrations and related scripts
COPY --from=builder /app/src/database/migrations /app/migrations
COPY --from=builder /app/scripts/migrateServerDB/docker.cjs /app/docker.cjs
COPY --from=builder /app/scripts/migrateServerDB/errorHint.cjs /app/errorHint.cjs

# Copy dependencies
COPY --from=builder /deps/node_modules/.pnpm /app/node_modules/.pnpm
COPY --from=builder /deps/node_modules/pg /app/node_modules/pg
COPY --from=builder /deps/node_modules/drizzle-orm /app/node_modules/drizzle-orm

# Copy server launcher
COPY --from=builder /app/scripts/serverLauncher/startServer.cjs /app/startServer.cjs

RUN \
    # Add nextjs:nodejs to run the app
    addgroup -S -g 1001 nodejs \
    && adduser -D -G nodejs -H -S -h /app -u 1001 nextjs \
    # Set permission for nextjs:nodejs
    && chown -R nextjs:nodejs /app

## Production image, copy all the files and run next
FROM scratch

# Copy all the files from app, set the correct permission for prerender cache
COPY --from=app / /

ENV NODE_ENV="production" \
    NODE_OPTIONS="--dns-result-order=ipv4first --use-openssl-ca" \
    NODE_EXTRA_CA_CERTS="" \
    NODE_TLS_REJECT_UNAUTHORIZED="" \
    SSL_CERT_DIR="/etc/ssl/certs/ca-certificates.crt"

# set hostname to localhost
ENV HOSTNAME="0.0.0.0" \
    PORT="3000"

USER nextjs

EXPOSE 3000/tcp

ENTRYPOINT ["/bin/node"]

CMD ["/app/startServer.cjs"]
