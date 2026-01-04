# Stage 1: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build arguments for NEXT_PUBLIC_* variables (required at build time)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GITHUB_TOKEN
ARG NEXT_PUBLIC_GITHUB_REPO_OWNER
ARG NEXT_PUBLIC_GITHUB_REPO_NAME
ARG NEXT_PUBLIC_GITHUB_CATEGORY_ID

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_GITHUB_TOKEN=${NEXT_PUBLIC_GITHUB_TOKEN}
ENV NEXT_PUBLIC_GITHUB_REPO_OWNER=${NEXT_PUBLIC_GITHUB_REPO_OWNER}
ENV NEXT_PUBLIC_GITHUB_REPO_NAME=${NEXT_PUBLIC_GITHUB_REPO_NAME}
ENV NEXT_PUBLIC_GITHUB_CATEGORY_ID=${NEXT_PUBLIC_GITHUB_CATEGORY_ID}

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
