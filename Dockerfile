FROM playcourt/nodejs:20-alpine AS builder
WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
USER root

RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
# RUN node sqlite.js
USER user

FROM playcourt/nodejs:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/collection.db ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

USER root

RUN chown -R user:nogroup /app/* \
    && chmod -R 775 /app/* 
# Expose Application Port

RUN sed -i -e 's|3.19|3.20|g' /etc/apk/repositories
RUN apk update && apk upgrade

USER user

EXPOSE 3000

CMD ["node","server.js"]
