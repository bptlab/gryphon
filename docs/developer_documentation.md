# Gryphon - Developer Docuentation

Gryphon is a tool that allows it to model scenario for fragment based case management.
Gryphon uses an HTTP-Server that delivers an front-end that can be used to model scenarios and a Rest-API to access them.
The provided API that is also used by the front-end allows it to store and load scenarios from the server and to run validation
algorithms that check certain parts of the scenarios.

## Components
The code base of Gryphon consists of 2 parts. The front-end and the back-end. Both tools are written in Javascript, the front-end uses
HTML5 to display the user-interface. The 2D-Modeller is provided by the bpmn-js library that allows it to deploy an BPMN-editor easily.
bpmn-js was extended by the developers to add features needed for the Chimera/Unicorn/Gryphon platform. The framework used to structure
the frontend was React.

The back-end is connected to a MongoDB that stores the process models. It provides an HTTP-Rest-API that can be used to access and manage them.
The API is provided using Express-JS, a framework for HTTP-servers in nodejs.

## Front-end
The front-end is written in HTML5 and Javascript. It uses React to specify the components of the user-interface.

## Front-end directory structure
All front-end files are contained in the public_src package. It contains 3 directorys and multiple files.
* /bpmn contains the additions to bpmn-js, including the extended bpmn-moddle specification. It also includes the main class that handles the editor (/editor.js).
* /olc contains the addition to bpmn-js that allow it to model object-lifecycles in gryphon. In also includes the main class that handles the olc-editor (/editor.js).
* /react contains all react components that are used to display the user-interface, including the root-component (/index.js)

The api.js file contains the simple API-Client that is used to access the REST-API that is provided by the back-end.
The index.js files contains the logic for the Router that decides which components get loaded and loads the main-component from /react/index.js.
The messagehandler.js is a central component that is used to send messages to the messagebar component.
The sidebarmanager.js is a component that allows it to enforce updates on the sidebar.

### BPMN-js Modifications
The graphical editors are wrapped in the editor.js files in the /bpmn and /olc directorys.

There are 2 important components associated with bpmn-js. They are bpmn-moddle and the bpmn-js-properties-panel.
bpmn-moddle manages the transformation of XML to javascript datastructures and the other way around using a format-specification in JSON.
bpmn-js-properties-panel renders a properties-panel that is used to access certain attributes of the objects edited using bpmn-js.

The properties panel is modified using the PropertyPanelProvider defined in /provider.js. The provider panel defines which edit-fields should be displayed when displaying the properties panel. It reuses the default functions and adds more fields by using the entry factory. It specifies which type makes a certain textfield available, and provides the name of the property that should get changed.

The bpmnextension contains the definitions of the additional fields in the xml that can be modified using the modified properties-panel. It extends the basic classes defined in the bpmn-moddle code. jsonpath is an important exception here, as it contains multiple key-value pairs stored as JSON inside of the XML code. This was necessary because there was no way to defined an array-attribute in XML and adding other sub-elements is rather complicated, as long as one still wants to use the default properties-panel. It works because the provider reads that field and creates an additional edit-field for every key that rewrites the content of this attribute.

The editor class placed in editor.js contains a wrapper around the bpmn-js modeller. It adds the bpmn and panel extentions to the modeller and renders the given fragment. It also adds an handler to the event-bus of bpmn-js that is used to update dataclass and state in case the name of an dataobject gets changed.

The olc directory and it's contents fulfill the same purpose, even though the changes are different. The main change is that a lot of interface-elements and possiblities to change the diagram are removed. Just the ability to draw circles and connect them is left. This is done by defining a new ContextProvider (context.js) and a new PaletteProvider (palette.js) that draw less elements then the original ones. The Editor in editor.js uses thoose two modules to replace the original ones and render the olc of an editor.

In case it's necessary to compare the functionality of the replacement addons with the original ones, one can check the corresponding files in the original repositorys of bpmn-io, they are contained in the properties-panel and the bpmn-js repositorys. As there is no documentation for bpmn-js code at the moment, it's necessary to do some reverse-engineering to understand how the modules in the bpmn-js world work and how they interact with each other.

## Back-end
All back-end files are stored in the /server_src directory.
The structure of the back-end uses the basic structure of the default Express-JS app. It contains helpers, that store independent logic, models that specify the data-model used to store the scenarios and the routes that specify the endpoints available in the REST-API. The app.js file contains the code to compose thoose 3 and set up the Express-JS app. The app is used in the /bin/www file to start a webserver that allows access to the REST-API.

A detailed documentation about the API provided by the HTTP-server is available as Swagger-Documentation. To understand and test our API you can use the swagger-ui provided on our homepage.

The package-structure of the backend code consists of 3 packages:
* helpers: Contains all code that is independent of the HTTP and Database and is used for validation and other tasks.
* models: Contains the specification of the database schema as described in the chapter "Database schema"
* routers: Contains the logic for the handling of requests and the endpoints of the API

### Database schema
The database schema consists of 4 main classes and was kept as simple as possible. It contains 9 Classes. There specific schemas inside the code for 4 of them, the other ones are directly specified as subclasses of one of them. Attribute with the datatype XML are Strings, but always contain XML Code generated by BPMN-js. This is the case for fragments and the olc of dataclasses.

The 4 specified classes are:
* Scenario (Contains a single scenario) in scenario.js
* Fragment (Contains a fragment) in fragment.js
* DomainModel (Contains the domainmodel of an scenario) in domainmodel.js
* Export (Used to store the available export-targets on the server) in export.js

Startcondition, ClassMapping and AttributeMapping are used to store the startconditions and the mapping specifications that are used when the modeller wants to use an event to trigger the case start of an scenario. They are part of the scenario schema.

DataClass and Attribute are used to specify the data-structure of the scenario in the DomainModel and are specified in the domainmodel.js.

All modules in the model package return the schema and the model when they are imported using require().

### Helpers
The backend package helpers contains multiple small and less small functions and classes used for very specific purposes.
There are 4 files in the helpers package:
* array.js contains a function that tests for equality of 2 arrays.
* error.js contains a function used in the endpoints to handle database errors
* json.js contains 2 funtions to parse the XML-code generated by bpmn-js into JS-Dictionarys
* validator.js contains the validators that check the state of fragments and scenarios.

The functionality of thoose modules is further described in the generated documentation.

### Routes
The routes package contains the handler for http-requests. They are structure by the mainly associated model, for example domainmodel.js contains endpoints that are mainly associated with the domainmodel-model.

Most endpoints in this package are rather simple, an functional overview and an input/output-specification is given in the Swagger-Documentation and the generated code-documentation.

### Other files
There is just one other file in the server_src directory, app.js. In app.js, most of the components in the other directorys are put together to set up the Express-JS app. This app is later used in the bin/www.js file to start the server.

Another closely related file is the file config.js created in the root directory of the project. This file contains all backend-specific settings. It is created out of the config.js.example by copying it or using 'grunt config' which does exactly the same. The propertys set there are documented in the file itself.
