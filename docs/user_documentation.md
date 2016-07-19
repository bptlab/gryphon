# Gryphon user documenation

Gryphon is a tool to model scenarios for fragment based case management. It is
possible to export thoose scenarios to Chimera for execution.

## Installation

To use Gryphon it's necessary to install it manually or deploy it using docker.
Using docker should be the easiest method, if docker is already available.
Especially on Windows, the setup requires a lot of dependencys. Because of this,
it's preferable to use Docker there.

### Manual installation

To use Gryphon the following requirements have to be met:
* nodejs
* MongoDB
* npm
* grunt-cli

Install node, MongoDB, grunt-cli and npm by using the installers or install guidelines
from the respective websites.

Clone the Gryphon-Repository using 'git clone git@github.com:bptlab/gryphon.git' and move
in the cloned directory. After that, run 'npm install' to install all nodejs requirements.
After that, you can use grunt to place some files at the correct places. Run 'grunt config' to
create copys of both config files and then edit the config files the way you need to. Inside of the
config.js the MongoDB instance is specified. If you don't have one, create it using the documentation
on the MongoDB homepage. After you've run npm and grunt, run 'grunt' without paremeters a second time
to copy some frontend-dependencies to the correct places and compile the frontend code.

After that, you can run the server using 'node bin/www'. As long as the instance is running,
the server is available on localhost:3000.

### Available Commands:
- node bin/www      # To start the server. Use "PORT=8080 node bin/www" to specify another port.
- grunt             # To build all UI files. This works only after npm install was done
- grunt config      # To copy both config examples, and give them the correct name.
- grunt browserify  # To build the custom UI js files again.

### Docker deployment

If you want to deploy gryphon using docker, which is the preferable way on Windows and still the easiest one
on Linux, as long as you have already installed docker, just clone the repository and 'run docker build -t griffindocker .'.
To start Gryphon start the container you have just build using: 'docker run -p 3000:3000 -it --rm --name griffin griffindocker'
Of course you need docker first to get this done, to install docker follow the installation guidelines on their homepage.

## Usage
