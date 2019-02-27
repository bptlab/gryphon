var React = require('react');
var API = require('./../../../api');
var MessageHandler = require('./../../../messagehandler');
var ComplianceQuery = require('./compliancequery');

var ComplianceCheckerComponent = React.createClass({
    getInitialState: function() {
        return {
            scenario: {},
            exports: [],
            selectedExportName: '',
            selectedExportUrl: '',
            complianceQuery: '',
            complianceResult: '',
            deployedScenarioId: 'n/a',
            deployedScenarioName: ''
        }
    },
    componentDidMount: function() {
        this.setState({
            scenario: this.props.scenario
          });

        this.fetchAvailableChimeraInstances();

        // update dropdown
        $('#chimera-instance-dtselect').selectpicker('refresh');
    },
    componentDidUpdate: function() {
        console.log(this.props);
        if (this.props.scenario._id != this.state.scenario._id) {
            this.setState({
                scenario: this.props.scenario
            });
        }

        // update dropdown
        $('#chimera-instance-dtselect').selectpicker('refresh');
    },
    handleSelectedExportChanged: function(e) {
        var newSelectedExportName = e.target.value;

        var chimeraEndpoint = this.state.exports.find(function(element) {
            return element.name === newSelectedExportName;
        });
        if (!chimeraEndpoint) {
            console.log("no endpoint named ", newSelectedExportName);
            return;
        }

        this.setState({
            selectedExportName: newSelectedExportName,
            selectedExportUrl: chimeraEndpoint.url
        }, this.fetchDeployedCases());
    },
    fetchAvailableChimeraInstances: function() {
        API.getAvailableExports(function(data){
            this.setState({
                exports: data,
                selectedExportName: data[0].name,
                selectedExportUrl: data[0].url
            });
            console.log("default chimera: ", data[0].name, data[0].url);
        }.bind(this))
    },
    fetchDeployedCases: function() {
        var chimeraUrl = this.state.selectedExportUrl;
        if (!chimeraUrl) {
            return;
        }

        queryUrl = chimeraUrl + "/scenario/?filter=" + this.state.scenario.name;
        console.log("queryUrl: ", queryUrl);

        $.getJSON(queryUrl, function(data) {
            console.log("response data: ", data);
            if(data.length == 0) {
                this.setState({
                    deployedScenarioId: "",
                    deployedScenarioName: "not found"
                });
            } else if(data.length == 1) {
                this.setState({
                    deployedScenarioId: data[0].id,
                    deployedScenarioName: data[0].name
                });
            } else {
                this.setState({
                    deployedScenarioId: "",
                    deployedScenarioName: "multiple matches"
                });
            }
        }.bind(this));
    },
    submitComplianceQuery: function(query) {
        if (!query) {
            console.log("empty query");
            return;
        }
        
        if (!this.state.deployedScenarioId) {
            console.log("scenario not deployed");
            return;
        }

        var chimeraUrl = this.state.selectedExportUrl;
        if (!chimeraUrl) {
            console.log("no chimera url");
            return;
        }

        queryUrl = chimeraUrl + "/scenario/" + this.state.deployedScenarioId + "/compliance/" + query;
        console.log("queryUrl: ", queryUrl);
        $.get(queryUrl, function(data) {
            console.log("response data: ", data);
            this.setState({complianceResult: data});
        }.bind(this));
    },
    render: function() {
        var chimeraInstances = [];
        chimeraInstances = chimeraInstances.concat(this.state.exports.map(function(chimeraInstance){
            var value = chimeraInstance.name;
            var key = "export_" + value;
            return (
                <option value={value} key={key}>{value}</option>
            )
        }));

        var complianceResult = "";
        if (this.state.complianceResult) {
            complianceResult = "Compliance result: " + this.state.complianceResult;
        }

        return (
            <form className="form-horizontal">
              <h3>Checking compliance</h3>

              <row>
                <div className="col-md-2">
                Chimera instance:
                </div>

                <div className="col-md-4">
                    <select
                        className="selectpicker"
                        onChange={this.handleSelectedExportChanged}
                        value={this.state.selectedExportName}
                        data-live-search="true"
                        id={"chimera-instance-dtselect"}>
                        <optgroup label="Chimera instance">
                            {chimeraInstances}
                        </optgroup>
                    </select>
                </div>

                <div className="col-md-1">
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={this.fetchDeployedCases}>
                            <i className={"fa fa-refresh"} />
                    </button>
                </div>

                <div className="col-md-5">
                    Deployed scenario id: {this.state.deployedScenarioId} ({this.state.deployedScenarioName})
                </div>
              </row>

              <row>
                  <div className="col-md-12">
                    <ComplianceQuery handleChange={this.submitComplianceQuery} />
                  </div>
              </row>

              <row>
                  <div className="col-md-12">
                  {complianceResult}
                  </div>
              </row>

            </form>
        );
    }
});
module.exports = ComplianceCheckerComponent;
