# Troubleshooting

## Installation

If running npm install fails:
Check wether you have installed all build-essentials (Otherwise run: sudo apt-get install build-essential)
Run: sudo npm install -g node-gyp
Try again.

When running on Windows, make sure to have the following additional dependencies installed:
* Python 2.7 (Python >= 3 won't work!)
* Any version of Visual Studio (use the --msvs_version=20XY switch for Visual Studio 20XY)

## Usage
Q: Why does the gryphon modeler does not let me create my case model.
A: Be sure to name them correctly, see naming conventions.