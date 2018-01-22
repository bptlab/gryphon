var React = require('react');
var SideBarManager = require('./../../sidebarmanager');

var AboutModal = React.createClass({
    render: function() {
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="aboutModalLabel" id="aboutModal">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="aboutModalLabel">About</h4>
                        </div>
                        <div className="modal-body">
                            <p>
                            The Gryphon case modeler is a tool for modeling case models developed by
                            the <a href="https://bpt.hpi.uni-potsdam.de/">Business Process Technology group</a>
                            at the Hasso Plattner Institute, University of Potsdam.
                            Development started in spring 2016 as part of a Bachelor project.
                            The code can be found at <a href="https://github.com/bptlab/gryphon">https://github.com/bptlab/gryphon</a>,
                            the user documentation can be found at <a href="https://bptlab.github.io/gryphon">https://bptlab.github.io/gryphon</a>.
                            </p>
                            <p>
                            It is based on the open source framework bpmn.io maintained by Camunda.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }//,
    // componentDidMount: function() {
    //     $('aboutModal').on('show.bs.modal', function (event) {
    //     }.bind(this))
    // }
});
module.exports = AboutModal
