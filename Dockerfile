FROM node:22-alpine AS build

WORKDIR /app

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=${PNPM_HOME}:${PATH}
ENV CI=true

RUN corepack enable

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/app/package.json packages/app/
COPY packages/core/package.json packages/core/

RUN pnpm install --frozen-lockfile

COPY packages ./packages

RUN pnpm run build:core

FROM oven/bun:1-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY --from=build /app/packages ./packages

EXPOSE 3000

CMD ["bun", "./packages/app/server.js"]
