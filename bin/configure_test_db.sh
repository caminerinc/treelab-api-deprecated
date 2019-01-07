#!/bin/bash
export PGPASSWORD="psql_password"

echo "Configuring elephante_test"

docker exec -it elephante_psql dropdb -U postgres elephante_test
docker exec -it elephante_psql createdb -U postgres elephante_test

node_modules/.bin/sequelize db:migrate
node_modules/.bin/sequelize db:seed:all

echo "elephante_test configured"