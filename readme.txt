Steps to get everything up and running:
0. Install nodejs
0.0.1. Install mongodb
0.0.1.1 Set up MongoDB host in config.js
1. run: npm install
2. to run the express server: node app.js

For the UI:
The raw UI files are stored in ./public_src. The files provided by the server are store in ./public.
As the JS-Files are the only ones that need to compile atm, there is just the ./public_src/js directory.
To compile the JS files starting with index.js run:

browserify -t [ babelify --presets [ react ] ] ./public_src/js/index.js -o ./public/js/bundle.js

Run the server and look at the index.html to continue.