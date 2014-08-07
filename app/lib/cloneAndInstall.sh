#!/bin/sh
#clone a github repo

REPO=$1
REPO_URL=$2

git clone $REPO_URL
cd $REPO
npm run nodehub
grunt build
