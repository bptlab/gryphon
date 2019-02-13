var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var DataObjectReference = require('./../dataobjectreference');

var CaseClassSelectorComponent = React.createClass({
    getInitialState: function() {
        return {
            caseclass: 'FlubWub',
            _id: ''
        }
    },
    componentDidMount: function() {
        this.setState({
            caseclass: this.props.scenario.domainmodel.caseclass,
            _id: this.props.scenario.domainmodel._id
          });

        // update dropdown
        $('#case-class-dtselect').selectpicker('refresh');
    },
    componentDidUpdate: function() {
        if (this.props.scenario.domainmodel._id != this.state._id) {
            this.setState({
                caseclass: this.props.scenario.domainmodel.caseclass,
                _id: this.props.scenario.domainmodel._id
            });
        }

        // update dropdown
        $('#case-class-dtselect').selectpicker('refresh');
    },
    getAvailableDataClasses: function() {
        var dataclasses = [];
        dataclasses = dataclasses.concat(this.props.scenario.domainmodel.dataclasses.map(function(dataclass){
            var value = dataclass.name;
            var key = "dataclass_" + value;
            return (
                <option value={value} key={key}>{value}</option>
            )
        }));
        return dataclasses;
    },
    handleCaseClassChange: function(e) {
        var newCaseClass = e.target.value;
        this.setState({caseclass: newCaseClass});
    },
    handleSaveClick: function(e) {
        this.submitAll();
        //this.setState({terminationconditions: terminationconditions}, this.submitAll);
    },
    submitAll: function(index) {
        API.exportDomainModel(this.state, function() {
            MessageHandler.handleMessage("success","Saved domain model!");
        }.bind(this));
    },
    render: function() {

        var dataclasses = this.getAvailableDataClasses();

        return (
            <form className="form-horizontal">
              <h3>Case class</h3>
              <row>

                <div className="col-sm-5">
                    <select className="selectpicker" onChange={this.handleCaseClassChange} value={this.state.caseclass} data-live-search="true" id={"case-class-dtselect"}>
                        <optgroup label="Data class">
                            {dataclasses}
                        </optgroup>
                    </select>
                </div>

                <div className="col-sm-3">
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={this.handleSaveClick}
                    >
                        <i className="fa fa-check"></i> Save
                    </button>
                </div>

              </row>

            </form>
        );
    }
});
module.exports = CaseClassSelectorComponent;
