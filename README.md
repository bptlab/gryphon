
### Installation 
1. Pre-requisites:
   - nodejs
   - mongodb
   - npm
   - grunt-cli (sudo npm install -g grunt-cli)
2. Create a database in MongoDB
3. Clone this repository: `git clone git@github.com:bptlab/gryphon.git`
4. Change directory: `cd gryphon`
5. run `npm install` 
6. run `grunt config` (or rename config.js.example to config.js and client_config.js.example to client_config.js)
7. Edit the config files, to configure the MongoDB host and the SUB_DIR parameter if its hosted under another path.
8. run: `grunt` to build and copy all necessary files.
9. To start the server run `node bin/www`.
10. In your browser go to `http:\\localhost:3000` to start editing.

### Available Commands:
- node bin/www      # To start the server. Use "PORT=8080 node bin/www" to specify another port.
- grunt             # To build all UI files. This works only after npm install was done
- grunt config      # To copy both config examples, and give them the correct name.
- grunt browserify  # To build the custom UI js files again.

### Using Gryphon in Docker

FOR ALL PEOPLE WHO JUST WANT TO USE THE EDITOR IN AN EASY AND WINDOWS COMPATIBLE WAY READ THIS:
If you just want to run the editor, instead of modifying it (even though that doesn't really matter,
you could also edit it this way, just the building part will take longer), you can run the whole
thing in a docker container in 3 easy steps:

Step One: Grab a cup of coffee.
Step Two: Install Docker.
Step Three: Run "docker build -t griffindocker ."
Step Four: Grab another cup of coffee.
Step Five: Run "docker run -p 3000:3000 -it --rm --name griffin griffindocker"

### Troubleshooting
If running npm install fails:
Check wether you have installed all build-essentials (Otherwise run: sudo apt-get install build-essential)
Run: sudo npm install -g node-gyp
Try again.

When running on Windows, make sure to have the following additional dependencies installed:
* Python 2.7 (Python >= 3 won't work!)
* Any version of Visual Studio (use the --msvs_version=20XY switch for Visual Studio 20XY)