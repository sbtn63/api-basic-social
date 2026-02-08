#!/bin/sh
set -e

echo "ENV = $ENV"

npx sequelize-cli db:migrate --env $ENV
npx sequelize-cli db:seed:all --env $ENV

exec node server.js
