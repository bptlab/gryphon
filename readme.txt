FOR ALL PEOPLE WHO JUST WANT TO USE THE EDITOR IN AN EASY AND WINDOWS COMPATIBLE WAY READ THIS:
If you just want to run the editor, instead of modifying it (even though that doesn't really matter,
you could also edit it this way, just the building part will take longer), you can run the whole
thing in a docker container in 3 easy steps:

Step One: Grab a cup of coffee.
Step Two: Install Docker.
Step Three: Run "docker build -t griffindocker ." without ""
Step Four: Grab another cup of coffee.
Step Five: Run "docker run -p 3000:3000 -it --rm --name griffin griffindocker"

#################################################################################################################

Steps to get everything up and running:
1. Install nodejs
2. Install mongodb
2.1 create a database in mongodb
2.2 Set the correct mongodb host in the config (Usually you just have to replace /griffin with /yourdbname)
3. Install npm (if not bundled with node)
4. run: npm install
5. to run the express server: node bin/www

If you run the editor for public usage on a server, set the API_HOST in public_src/js/config.js correctly and re-run
broswerify.

If running npm install fails:
Check wether you have installed all build-essentials (Otherwise run: sudo apt-get install build-essential)
Run: sudo npm install -g node-gyp
Try again.

About the UI-Files:
The raw UI files are stored in ./public_src. The files provided by the server are store in ./public.
As the JS-Files are the only ones that need to compile atm, there is just the ./public_src/js directory.
To compile the JS files starting with index.js run:

browserify -t [ babelify --presets [ react ] ] ./public_src/js/index.js -o ./public/js/bundle.js

Run the server and look at the index.html to continue.

When running Windows, make sure to have the following additional dependencies installed:
* Python 2.7 (Python >= 3 won't work!)
* Any version of Visual Studio (use the --msvs_version=20XY switch for Visual Studio 20XY)