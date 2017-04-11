# Getting Started

## Local Installation (for developers)

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

When using Windows you have to install the following additional
dependencies:

-   Install **Python 2.7.X (not Python 3)**, available
    [here](https://www.python.org/downloads/release/python-2713/). Add
    the directory containing the python.exe executable to your PATH
-   Install Microsoft \*Visual Studio Community Edition 2015 (not
    2017)\*, available
    [here](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx).
    -   Be sure to select Windows 10 SDK and Windows 8.1 SDK during
        installation
-   Configure npm to use the right version of Visual Studio:
    `npm config set msvs_version 2015`
-   Configure npm with the path to your Python executable:
    `npm config set python C:\YOUR_PYTHON_DIRECTORY\python.exe`

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

## Running Gryphon
Once your environment is set up, you can start the editor as follows

1.  Navigate to the gryphon directory in your command line
2.  Start the MongoDB server (if it is not already started) by running
    `mongod --dbpath ../mongodata` on the command line
3.  Run the express server by calling `node bin/www` on the command line
4.  You can now access the editor in your browser at
    <http://localhost:3000/>

## Using Gryphon in Docker

FOR ALL PEOPLE WHO JUST WANT TO USE THE EDITOR IN AN EASY AND WINDOWS COMPATIBLE WAY READ THIS:
If you just want to run the editor, instead of modifying it (even though that doesn't really matter,
you could also edit it this way, just the building part will take longer), you can run the whole
thing in a docker container in 3 easy steps:

Step One: Grab a cup of coffee.
Step Two: Install Docker.
Step Three: Run "docker build -t griffindocker ."
Step Four: Grab another cup of coffee.
Step Five: Run "docker run -p 3000:3000 -it --rm --name griffin griffindocker"

{% include Howto.md %}
{% include Troubleshooting.md %}
