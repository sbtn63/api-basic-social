FROM node:20.20.1-alpine3.22

RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY src ./src

COPY .sequelizerc ./
COPY entrypoint.sh ./
RUN chmod +x /app/entrypoint.sh

EXPOSE $PORT

CMD ["sh", "/app/entrypoint.sh"]
