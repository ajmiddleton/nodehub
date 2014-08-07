#!/bin/sh
#start new deploy process

NEXT_PORT=$1
NEW_DB=$2
NAME=$3

PORT=$NEXT_PORT DBNAME=$NEW_DB pm2 start app/app.js --name $NAME
