FROM node:22-bookworm-slim

ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

WORKDIR /app

RUN corepack enable

COPY docker/nodejs/entrypoint.sh /usr/local/bin/nodejs-entrypoint.sh
RUN chmod +x /usr/local/bin/nodejs-entrypoint.sh

ENTRYPOINT ["nodejs-entrypoint.sh"]
