#!/bin/bash
export PGPASSWORD="psql_password"

echo "Configuring elephante_db"

docker exec -it elephante_psql dropdb -U postgres elephante_db
docker exec -it elephante_psql createdb -U postgres elephante_db

node_modules/.bin/sequelize db:migrate
node_modules/.bin/sequelize db:seed:all

echo "elephante_db configured"
