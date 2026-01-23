FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . /app

RUN chmod +x /app/entrypoint.sh

EXPOSE $PORT

CMD ["sh", "/app/entrypoint.sh"]
