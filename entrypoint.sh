#!/bin/sh
set -e

echo "ENV = $ENV"

npx sequelize-cli db:migrate --config src/db/config/index.cjs --migrations-path src/db/migrations --models-path src/db/models --env $ENV
npx sequelize-cli db:seed:all --config src/db/config/index.cjs --seeders-path src/db/seeders --env $ENV --seed

exec node src/server.js
