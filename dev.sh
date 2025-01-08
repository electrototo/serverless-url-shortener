#!/bin/bash

cd dev

# stop the dev server
docker rm dynamodb-local
docker compose up -d

# try and create the table used for the project
cd ..
./node_modules/.bin/ts-node dev/create-ddb-table.ts