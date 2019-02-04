#!/bin/bash
export PGPASSWORD="psql_password"

echo "Configuring treelab_db"

docker exec -it treelab_psql dropdb -U postgres treelab_db
docker exec -it treelab_psql createdb -U postgres treelab_db

node_modules/.bin/sequelize db:migrate --env=develop
node_modules/.bin/sequelize db:seed:all --env=develop

echo "treelab_db configured"
