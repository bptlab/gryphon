var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var Dropdown = require('../dropdown');

var CaseClassSelectorComponent = React.createClass({
    getInitialState: function() {
        return {
            caseclass: '',
            _id: ''
        }
    },
    componentDidMount: function() {
        this.setState({
            caseclass: this.props.scenario.domainmodel.caseclass,
            _id: this.props.scenario.domainmodel._id
          });
    },
    componentDidUpdate: function() {
        if (this.props.scenario.domainmodel._id != this.state._id) {
            this.setState({
                caseclass: this.props.scenario.domainmodel.caseclass,
                _id: this.props.scenario.domainmodel._id
            });
        }
    },
    handleCaseClassChange: function(index, value) {
        this.setState({caseclass: value});
    },
    handleSaveClick: function(e) {
        this.submitAll();
    },
    submitAll: function(index) {
        API.exportDomainModel(this.state, function() {
            MessageHandler.handleMessage("success","Saved domain model!");
        }.bind(this));
    },
    render: function() {

        var dataclasses = [].concat(this.props.scenario.domainmodel.dataclasses.map(function(dataclass){
            return dataclass.name;
        }));

        return (
            <form className="form-horizontal">
              <h3>Case class</h3>
              <row>

                <div className="col-sm-5">
                    <Dropdown
                        id="caseClass"
                        handleSelectionChanged={this.handleCaseClassChange}
                        options={dataclasses}
                        selectedValue={this.state.caseclass}
                    />
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
