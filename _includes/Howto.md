### []{#Modelling_a_Case_1}Modelling a Case

You can create a new case model by clicking the “Create a
scenario”-Button in the Gryphon sidebar.

Your browser does not support HTML video.

A case model consists of:

-   fragments, that hold the execution steps
-   a domain model, that holds the data definitions
-   start and termination conditions that define beginning and ending of
    a case

When you create a new case model, a first fragment is automatically
created as well. You can rename that fragment in the sidebar.

Your browser does not support HTML video.

You can edit the fragment by selecting it in the sidebar, or in the case
overview page. In the integrated [bpmn.io](http://bpmn.io) editor, you
can define the execution steps in BPMN language.

Your browser does not support HTML video.

You can create new fragments in the case overview page, as well as give
them a fitting name.

Your browser does not support HTML video.

In order to use data objects in the fragments, their corresponding data
classes have to be defined in the domain model. The domain model for a
case can be reached via the sidebar. In the domain model, you can create
new data classes and event types.

Your browser does not support HTML video.

For each class, you can define attributes with data types.

Your browser does not support HTML video.

Also, you can define object life cycles. These represent the possible
data state transitions that can occur during the execution of the case.

Your browser does not support HTML video.

The object life cycles will be checked against the modelled data flow
when saving a fragment. The user will be warned, if a state or state
transition is found, that was not modelled in the object life cycle.

Your browser does not support HTML video.

In the case overview, you can add start conditions and termination
conditions.

In start conditions, you can register for certain events that trigger
the instantiation of a case. You can define data classes that are
instantiated into a certain state, as well as attribute values from the
event that should be saved.

Your browser does not support HTML video.

Termination conditions define sets of data states, that when reached,
symbolize that the case is terminated.

Your browser does not support HTML video.

##### []{#Event_integration_45}Event integration

In fragments, events can be modelled with BPMN message receive events.
You can add an event query to these events in the fragment sidebar. The
event query is registered in a running instance of the Unicorn
plattform. Once it triggers, the BPMN event will be triggered as well.

Your browser does not support HTML video.

Similar to start conditions, you can also define data attribute values
that should be saved from events. To this end, you have to add outgoing
data objects to the event. In the fragment sidebar, you can then add
JSONPath expressions for the data attributes.

Your browser does not support HTML video.

Further reading about event integration can be found in the [bachelor
thesis](https://bpt.hpi.uni-potsdam.de/FCM/CMPublications) of Jonas
Beyer.

### []{#Executing_a_Case_55}Executing a Case

In the case overview, case models can be exported to running Chimera
instances. In the export window, export targets for running Chimera
instances can be defined by clicking the “Add target” button.

Your browser does not support HTML video.

See [the Chimera
documentation](https://bpt.hpi.uni-potsdam.de/Chimera/GettingStarted)
for further information on the execution of cases.
