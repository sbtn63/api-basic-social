FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE $PORT

CMD ["sh", "/app/entrypoint.sh"]
