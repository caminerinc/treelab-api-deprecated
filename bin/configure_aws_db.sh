#!/bin/bash
#run with: export PGPASSWORD=xxxxxxx ./bin/configure_aws_db.sh
echo "Configuring treelab_aws"

node_modules/.bin/sequelize db:migrate --env=aws
node_modules/.bin/sequelize db:seed:all --env=aws

echo "treelab_test configured"