FROM node:26.13.1-alpine3.23

RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY src ./src

COPY .sequelizerc.cjs ./
COPY entrypoint.sh ./
RUN chmod +x /app/entrypoint.sh

EXPOSE $PORT

CMD ["sh", "/app/entrypoint.sh"]
