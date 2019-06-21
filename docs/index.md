---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default


---

<img src="vid\gryphon.jpg" alt="Gryphon" width="330" height="300">

# Getting Started
## Local Installation
### Prerequisites

The following software is necessary to build and run the editor:
- Install [Node.js](https://nodejs.org/en/download/) (this includes the node package manager `npm`)
- Install node-gyp by running `npm install -g node-gyp` on the command line, e.g. [cygwin](https://cygwin.com/) or Window `cmd`
    - Unix/Mac: this may require the build-essentials tools, which you can install with `sudo apt-get install build-essential`
- Install **browserify** by running `npm install -g browserify`
- install grunt-cli by runniing `npm install -g grunt-cli`
    - add the `bin` directory to your path (default directory is `C:\Program Files\MongoDB\Server\3.4\bin` )

### Initial Setup
1. Clone the source code repository from [github](https://github.com/bptlab/gryphon) (e.g. by running `git clone https://github.com/bptlab/gryphon.git on the command line` )
  - we recommend to create a folder `zoo` and clone into `zoo/gryphon`
  - the following commands assume that you are in the gryphon directory!
2. Run `npm install` (in the gryphon directory) to set up all additional dependency packages.
3. Run `grunt config` (in the gyphon directory) to copy both config examples and to give them the correct names.
4. Setup MongoDB
  - create a data directory, e.g. in `zoo/mongodata`
  - start database server by running `mongod --dbpath ../mongodata` on the command line (if your data directory is somewhere else, be sure to adapt the path accordingly)
  - start the `mongo` client by running mongo on the command line
  - inside the mongo client create a database named gryphondb with the command `use gryphondb`
    - if you named your database differently, you need to adapt the database name in `config.js` by editing the property `MONGODB_HOST: 'mongodb://localhost/YOUR_DATABASE_NAME`
5. Run `grunt` (in the gyphon directory) to build the UI files and to compile all script sources.
6. Run the express server by calling node `bin/www` on the command line.
7. You can now access the editor in your browser at [http://localhost:3000/](http://localhost:3000/)

## Running gryphon
Once your environment is set up, you can start the editor as follows
1. Navigate to the gryphon directory in your command line.
2. Start the MongoDB server (if it is not already started) by running `mongod --dbpath ../mongodata` on the command line.
3. Run the express server by calling node `bin/www` on the command line.
4. You can now access the editor in your browser at [http://localhost:3000/](http://localhost:3000/)

- Incase you are still unsure of installing and running Gryphon on your system, you can also follow the Screencast below:

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\install-gryphon.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

# Using Gryphon in Docker
FOR ALL PEOPLE WHO JUST WANT TO USE THE EDITOR IN AN EASY AND WINDOWS COMPATIBLE WAY READ THIS: If you just want to run the editor, instead of modifying it (even though that doesn’t really matter, you could also edit it this way, just the building part will take longer), you can run the whole thing in a docker container in 3 easy steps:

Step One: Grab a cup of coffee. Step Two: Install Docker. Step Three: Run “docker build -t griffindocker .” Step Four: Grab another cup of coffee. Step Five: Run “docker run -p 3000:3000 -it –rm –name griffin griffindocker”

# *Creating a Case Model*
You can create a new case model by clicking the “Create a scenario”-Button in the Gryphon sidebar.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\create_case_model.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

A case model consists of:
- fragments, that hold the execution steps
- a domain model, that holds the data definitions
- start and termination conditions that define beginning and ending of a case

When you create a new case model, a first fragment is automatically created as well. You can rename that fragment in the sidebar.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\rename_fragment.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

*Naming conventions*

The names of case model elements (fragments, data classes, attributes, task names etc.) can contain only alpha-numeric characters, underscores and spaces. The first and last character need to be alpha-numeric. There may not be more than 1 non-alphanumeric character in a row. This is checked by the following regular expression: `^([a-zA-Z\d]|[a-zA-Z\d](?!.*[ _]{2})[a-zA-Z\d _]*?[a-zA-Z\d])$`.

## Creating and editing fragments
You can create new fragments on the case overview page, as well as give them a descriptive name.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\create_new_fragment.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

You can edit fragments by selecting it in the sidebar, or in the case overview page. In the integrated [bpmn.io](http://bpmn.io/) editor, you can define the execution steps in BPMN language.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\model_fragment.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

## Supported Modeling Elements

Although the bpmn.io editor offers a variety of types for events and activities, e.g. user task, conditional start event, most of these elements are **not supported** by the execution engine [Chimera](https://bptlab.github.io/chimera/). Using them might cause the deployment to fail. The following elements are supported:

- plain start events
- message start event
- plain end event
- intermediate timer event
- intermediate message catch event
- intermediate message throw event
- exclusive (XOR) gateways
- parallel (AND) gateways
- event-based gateways
- plain tasks
- manual tasks (treated as plain task)
- user tasks (treated as plain task)
- service tasks (result in an webservice task)
- send task (result in an email task)
- data objects (need to refer to a data class and a state, e.g. `DC1[state2]`)

Some modeling constructs have additional attributes in the properties panel. For example, service tasks have attributes for the URL of the webservice to call, the http method, the body, and so on.

## Syntax for Timer Events

The syntax for timer events follows the [ISO 8601 standard](https://en.wikipedia.org/wiki/ISO_8601). However, **only durations are supported**. The timer expression has to be provided as a property of the timer event. An example for a timer expression is `P1DT2H5M25S`, which means a duration of one day, 2 hours, 5 minutes and 25 seconds.

Offering support for fixed points in time would only make sense, when the time could be set programmatically. Otherwise, such an event could occur only once and once it is past, it would never occur, even in newly created cases.

## Process variables

Variables allow to access the case data in gateways, service tasks, and send tasks.

## Usage in data-based gateways
The branches leaving a XOR split can be annotated with an expression that evaluates to true or false. Basically, there are two types of expressions: 1) data object state conditions and 2) attribute value conditions. The former check the state of a data object, while the later check attribute values. To refer to a data object, use a hash symbol followed by the data class name, an equality operator and a state, e.g. `#Application = rejected`. To access attribute values, use the dot-notation, i.e. `#Application.amount <= 5000`. Only those branches for which the expression yields true are control-flow enabled.

## Fragment Pre-Conditions
To express that a fragment, and thus its activities, should only be enabled when the case is in a certain state, conditional start events can be used. The label of the event should contain an expression that specifies which data objects need to be in which state for the fragment to be enabled, e.g. `Customer[verified]`.

# Defining the Data Model

In order to use data objects in the fragments, their corresponding data classes have to be defined in the domain model. The domain model for a case can be reached via the sidebar. In the domain model, you can create new data classes and event types.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\create_data_class.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

For each class, you can define attributes with data types.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\add_attributes.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

Also, you can define object life cycles. These represent the possible data state transitions that can occur during the execution of the case.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\edit_olc.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

The object life cycles will be checked against the modelled data flow when saving a fragment. The user will be warned, if a state or state transition is found, that was not modelled in the object life cycle.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\olc_check.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

# Termination Conditions and Case Start Triggers

In the case overview, you can add termination conditions and case start triggers.

Case models can have several termination conditions defining the goal state(s) of the case. When the case execution fulfills one of the termination conditions it can be terminated by the user. Termination conditions consists of one or more atomic data object state conditions that are pairs of a data class name and one of its states, e.g. `Application[accepted]`. Several of those data object state conditions are separated by a comma, meaning that all of the conditions, i.e. their conjunction, has to be fulfilled, e.g. `Application[accepted]`, Customer[verified] means that application is in state accepted and the customer is verified.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\termination_condition.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

Case start triggers are used to automatically create a case whenever a specific external event occurs. Each start trigger contains an Esper EPL query that is registered with the event processing platform [Unicorn](https://bpt.hpi.uni-potsdam.de/UNICORN). When an event matching this query occurs (and is detected by Unicorn) the Chimera engine is notified and a case is instantiated. Additionally, data classes can be defined, data objects of which will be automatcally instantiated in the specified state. Also, data contained in the event notification can be mapped to attributes of the instantiated data objects. For each attribute that should instantiated the user has to provide a **JsonPath** expression that will be applied to the event notification and the result will be stored in the selected attribute. In this way, event data can be used inside a case by mapping.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\start_condition.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

# Event integration
In fragments, events can be modelled with BPMN message receive events. You can add an event query to these events in the fragment sidebar. The event query is registered in a running instance of the Unicorn plattform. Once it triggers, the BPMN event will be triggered as well.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\model_event.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

Similar to case start triggers, you can also define data attribute values that should be saved from events. To this end, you have to add outgoing data objects to the event. In the fragment sidebar, you can then add JSONPath expressions for the data attributes.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\model_jsonpath.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

Further reading about event integration can be found in the [bachelor thesis](https://bpt.hpi.uni-potsdam.de/FCM/CMPublications) of Jonas Beyer.

# Executing a Case
In the case overview, case models can be deployed to running Chimera instances. In the export window, export targets for running Chimera instances can be defined by clicking the “Add target” button.

<video width="550" autoplay="" loop="" muted="">
    <source src="vid\export_model.webm" type="video/webm">
    Your browser does not support HTML video.
</video>

See the [Chimera documentation](https://bptlab.github.io/chimera/) for further information on the execution of cases.

# Troubleshooting
## installation
If running npm install fails: Check whether you have installed all build-essentials (Otherwise run: `sudo apt-get install build-essential`) Run: `sudo npm install -g node-gyp` Try again.

When running on Windows, make sure to have the following additional dependencies installed:
- Python 2.7 (Python >= 3 won’t work!)
- Any version of Visual Studio (use the –msvs_version=20XY switch for Visual Studio 20XY)

## Usage
Q: Why does the gryphon modeler does not let me create my case model. A: Be sure to name them correctly, see naming conventions.
