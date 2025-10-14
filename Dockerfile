FROM node:22-alpine

WORKDIR /app

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=${PNPM_HOME}:${PATH}

RUN corepack enable

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/app/package.json packages/app/
COPY packages/core/package.json packages/core/

RUN pnpm install --frozen-lockfile --prod

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start"]
