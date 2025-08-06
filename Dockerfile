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
ARG DATABASE_URL
ARG DATABASE_DRIVER
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_OPENAPI_ENDPOINT

ARG NEXT_PUBLIC_OIDC_CLIENT_ID
ARG AUTH_SECRET

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

ARG LOBE_DATABASE_URL
ARG LOBE_DATABASE_DRIVER

ARG ADMIN_DATABASE_URL
ARG ADMIN_DATABASE_DRIVER
ARG ADMIN_KEY_VAULTS_SECRET

ARG ALIYUN_MAIL_SMTP_HOST
ARG ALIYUN_MAIL_SMTP_PORT
ARG ALIYUN_MAIL_SMTP_USER
ARG ALIYUN_MAIL_SMTP_PASS

# Node
ENV NODE_OPTIONS="--max-old-space-size=6144"

# Zephyr 环境变量
ENV DATABASE_URL="${DATABASE_URL}" \
    DATABASE_DRIVER="${DATABASE_DRIVER:-node}" \
    NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL}" \
    NEXT_PUBLIC_APP_NAME="${NEXT_PUBLIC_APP_NAME:-保险客户管理系统}" \
    NEXT_PUBLIC_OPENAPI_ENDPOINT="${NEXT_PUBLIC_OPENAPI_ENDPOINT}"

# OIDC 环境变量
ENV NEXT_PUBLIC_OIDC_CLIENT_ID="${NEXT_PUBLIC_OIDC_CLIENT_ID:-zephyr}" \
    AUTH_SECRET="${AUTH_SECRET}"

# Clerk 环境变量
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}" \
    CLERK_SECRET_KEY="${CLERK_SECRET_KEY}"

# LobeHub Chat 环境变量
ENV LOBE_DATABASE_URL="${LOBE_DATABASE_URL}" \
    LOBE_DATABASE_DRIVER="${LOBE_DATABASE_DRIVER:-node}"

# Admin 环境变量
ENV ADMIN_DATABASE_URL="${ADMIN_DATABASE_URL}" \
    ADMIN_DATABASE_DRIVER="${ADMIN_DATABASE_DRIVER:-node}" \
    ADMIN_KEY_VAULTS_SECRET="${ADMIN_KEY_VAULTS_SECRET}"

# 阿里云邮件服务环境变量
ENV ALIYUN_MAIL_SMTP_HOST="${ALIYUN_MAIL_SMTP_HOST}" \
    ALIYUN_MAIL_SMTP_PORT="${ALIYUN_MAIL_SMTP_PORT}" \
    ALIYUN_MAIL_SMTP_USER="${ALIYUN_MAIL_SMTP_USER}" \
    ALIYUN_MAIL_SMTP_PASS="${ALIYUN_MAIL_SMTP_PASS}"

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
    PORT="3020"

# Zephyr 相关
ENV DATABASE_URL="" \
    DATABASE_DRIVER="node"

# LobeHub Admin 相关
ENV ADMIN_DATABASE_URL="" \
    ADMIN_DATABASE_DRIVER="node" \
    ADMIN_KEY_VAULTS_SECRET=""

# LobeHub Chat 相关
ENV LOBE_DATABASE_DRIVER="node" \
    LOBE_DATABASE_URL=""

USER nextjs

EXPOSE 3020/tcp

ENTRYPOINT ["/bin/node"]

CMD ["/app/startServer.cjs"]
