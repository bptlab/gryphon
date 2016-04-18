#!/usr/bin/env bash
service mongod start
npm install -g node-gyp
npm install
grunt config
grunt
node ./bin/www