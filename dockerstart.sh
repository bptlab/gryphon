#!/usr/bin/env bash
service mongod start
npm install -g node-gyp
npm install
browserify -t [ babelify --presets [ react ] ] ./public_src/js/index.js -o ./public/js/bundle.js
node ./bin/www