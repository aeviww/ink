FROM node:24-bookworm-slim AS build

ENV NUXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production \
  NUXT_TELEMETRY_DISABLED=1 \
  HOST=0.0.0.0 \
  PORT=3000

WORKDIR /app

RUN groupadd --gid 10001 ink \
  && useradd --uid 10001 --gid ink --shell /usr/sbin/nologin --create-home ink \
  && install -d -o ink -g ink -m 0700 /app/data /app/backups

COPY --from=build --chown=ink:ink /app/.output ./.output
COPY --from=build --chown=ink:ink /app/scripts ./scripts
COPY --from=build --chown=ink:ink /app/package.json ./package.json

USER ink
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]