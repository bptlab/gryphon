FOR ALL PEOPLE WHO JUST WANT TO USE THE EDITOR IN AN EASY AND WINDOWS COMPATIBLE WAY READ THIS:
If you just want to run the editor, instead of modifying it (even though that doesn't really matter,
you could also edit it this way, just the building part will take longer), you can run the whole
thing in a docker container in 3 easy steps:

Step One: Grab a cup of coffee.
Step Two: Install Docker.
Step Three: Run "docker build -t griffindocker ."
Step Four: Grab another cup of coffee.
Step Five: Run "docker run -p 3000:3000 -it --rm --name griffin griffindocker"

#################################################################################################################

### 8 Steps to get everything up and running manually:
1. Install:
   - nodejs
   - mongodb
   - npm
   - grunt-cli (sudo npm install -g grunt-cli)
2. Create a database in mongodb
3. run: "npm install"
4. run: "grunt config" or rename config.js.example to config.js and client_config.js.example to client_config.js
5. Edit the config files, especially configure the MongoDB host and the SUB_DIR parameter if its hosted under another path.
6. run: "grunt" to build and copy all necessary files.
7. run: "node bin/www"

### Available Commands:
- node bin/www      # To start the server. Use -PORT to specify a port.
- grunt             # To build all UI files. This works only after npm install was done
- grunt config      # To copy both config examples, and give them the correct name.
- grunt browserify  # To build the custom UI js files again.

### Troubleshooting
If running npm install fails:
Check wether you have installed all build-essentials (Otherwise run: sudo apt-get install build-essential)
Run: sudo npm install -g node-gyp
Try again.

When running on Windows, make sure to have the following additional dependencies installed:
* Python 2.7 (Python >= 3 won't work!)
* Any version of Visual Studio (use the --msvs_version=20XY switch for Visual Studio 20XY)