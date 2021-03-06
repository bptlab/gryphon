Getting Started
===============

Local Installation (for developers)
-----------------------------------

### Prerequisites

The following software is necessary to build and run the editor:

-   Install **Node.js**, available
    [here](https://nodejs.org/en/download/) (this includes the node
    package manager `npm`)
-   Install **node-gyp** by running `npm install -g node-gyp` on the
    command line, e.g. [cygwin](https://cygwin.com) or Window `cmd`
    -   Unix/Mac: this may require the **build-essentials** tools, which
        you can install with `sudo apt-get install build-essential`
-   Install **browserify** by running `npm install -g browserify`
-   Install **grunt-cli** by runniing `npm install -g grunt-cli`
-   Install **mongodb**, available
    [here](https://www.mongodb.org/downloads).
    -   add the `bin` directory to your path (default directory is
        `C:\Program Files\MongoDB\Server\3.4\bin`)

### Initial setup

1.  Clone the source code repository from
    [github](http://github.com/bptlab/gryphon) (e.g. by running
    `git clone https://github.com/bptlab/gryphon.git` on the command
    line)
    -   we recommend to create a folder `zoo` and clone into
        `zoo/gryphon`
    -   the following commands assume that you are in the gryphon
        directory!
2.  Run `npm install` (in the gryphon directory) to set up all
    additional dependency packages
3.  Run `grunt config` (in the gyphon directory) to copy both config
    examples and to give them the correct names
4.  Setup MongoDB
    -   create a data directory, e.g. in `zoo/mongodata`
    -   start database server by running `mongod --dbpath ../mongodata`
        on the command line (if your data directory is somewhere else,
        be sure to adapt the path accordingly)
    -   start the mongo client by running `mongo` on the command line
    -   inside the mongo client create a database named gryphondb with
        the command `use gryphondb`
        -   if you named your database differently, you need to adapt
            the database name in `config.js` by editing the property
            `MONGODB_HOST: 'mongodb://localhost/YOUR_DATABASE_NAME`
5.  Run `grunt` (in the gyphon directory) to build the UI files and to
    compile all script sources

Starting Gryphon
----------------

Once your environment is set up, you can start the editor as follows

1.  Navigate to the gryphon directory in your command line
2.  Start the MongoDB server (if it is not already started) by running
    `mongod --dbpath ../mongodata` on the command line
3.  Run the express server by calling `node bin/www` on the command line
4.  You can now access the editor in your browser at
    <http://localhost:3000/>

### Using Gryphon in Docker

If you just want to run the editor, instead of modifying it (even though that doesn't really matter,
you could also edit it this way, just the building part will take longer), you can run the whole
thing in a docker container in 3 easy steps:

1.  Install Docker.
2.  `cd` into the gryphon dir and run `docker build -t bpt/gryphon .`
3.  Run `docker run -it --rm -p 3000:3000 --name gryphon -v gryphon-mongodb-data:/var/lib/mongodb bpt/gryphon`


### Using Gryphon in Docker Compose
MOST EASY AND CONVENIENT WAY TO RUN GRYPHON

1. Install docker & docker-compose
1. `docker-compose up`

### Troubleshooting
If running npm install fails:
Check wether you have installed all build-essentials (Otherwise run: `sudo apt-get install build-essential`)
Run: `sudo npm install -g node-gyp`
Try again.

When running on Windows, make sure to have the following additional dependencies installed:
* Python 2.7 (Python >= 3 won't work!)
* Any version of Visual Studio (use the --msvs_version=20XY switch for Visual Studio 20XY)
