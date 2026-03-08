FROM node:20-alpine

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
