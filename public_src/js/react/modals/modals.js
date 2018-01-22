var React = require('react');
var AboutModal = require('./about');
var CreateDomainModelClassModal = require('./createdomainmodelclass');
var DeleteDomainModelClassModal = require('./deletedomainmodelclass');
var ModifyDomainModelClassModal = require('./modifydomainmodelclass');
var CreateFragmentModal = require('./createfragment');
var ModifyFragmentModal = require('./modifyfragment');
var CreateScenarioModal = require('./createscenario');
var DeleteScenarioModal = require('./deletescenario');
var DeleteFragmentModal = require('./deletefragment');
var ExportScenarioModal = require('./exportscenario');
var ModifyExportTargetsModal = require('./modifyexporttargets');

/**
 * All modals used in the project
 * They are up here because bootstrap modals should be placed below the root node of the page.
 * Calling them becomes quite complex because of this (It would be necessary to provide a callback down through every module)
 * Instead of this I used the basic bootstrap logic (attributes of buttons or links)
 * This made the transport of data to the modal quite complex.
 * The data is stored as attribute in the calling button or link and is read here again when the modal is created.
 * This is a quite ugly way (totally not the react-way of life, but it's the way
 * preferred by bootstrap) but it seemed as the best solution when I wrote that.
 * I'm sorry.
 */
var ModalComponent = React.createClass({
    render: function() {
        return (
            <div>
                <AboutModal />
                <CreateDomainModelClassModal />
                <DeleteDomainModelClassModal />
                <ModifyDomainModelClassModal />
                <CreateFragmentModal />
                <DeleteFragmentModal />
                <ModifyFragmentModal />
                <CreateScenarioModal />
                <DeleteScenarioModal />
                <ExportScenarioModal />
                <ModifyExportTargetsModal />
            </div>
        )
    }
});

module.exports = ModalComponent;
