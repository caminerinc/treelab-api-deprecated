#!/bin/bash
export PGPASSWORD="psql_password"

echo "Configuring treelab_test"

docker exec -it treelab_psql dropdb -U postgres treelab_test
docker exec -it treelab_psql createdb -U postgres treelab_test

node_modules/.bin/sequelize db:migrate --env=test
node_modules/.bin/sequelize db:seed:all --env=test

echo "treelab_test configured"