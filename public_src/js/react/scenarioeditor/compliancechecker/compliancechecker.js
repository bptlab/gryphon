var React = require('react');
var API = require('./../../../api');
var MessageHandler = require('./../../../messagehandler');
var ComplianceQuery = require('./compliancequery');
var ComplianceResultDisplay = require('./complianceresultdisplay');
var Dropdown = require('../../dropdown');

var ComplianceCheckerComponent = React.createClass({
    getInitialState: function () {
        return {
            exports: [],
            selectedExportName: '',
            selectedExportUrl: '',
            complianceQuery: '',
            complianceResult: '',
            deployedScenarioId: 'n/a',
            deployedScenarioName: '',
            caseInstances: [],
            selectedCaseInstanceId: ''
        }
    },
    componentDidMount: function () {
        this.fetchAvailableChimeraInstances();
    },
    componentDidUpdate: function (prevProps) {
        if (this.props.scenario.name
            && this.props.scenario.name != prevProps.scenario.name
            && this.state.selectedExportName) {
            this.fetchDeployedCaseModels();
        }
    },
    fetchAvailableChimeraInstances: function () {
        API.getAvailableExports(function (data) {
            this.setState({
                exports: data,
                selectedExportName: data[0].name,
                selectedExportUrl: data[0].url
            });
            console.log("default chimera: ", data[0].name, data[0].url);
        }.bind(this))
    },
    handleSelectedExportChanged: function (index, value) {
        var chimeraInstance = this.state.exports[index];
        console.log(this.state.exports, chimeraInstance);

        this.setState({
            selectedExportName: chimeraInstance.name,
            selectedExportUrl: chimeraInstance.url
        }, this.fetchDeployedCaseModels);
    },
    fetchDeployedCaseModels: function () {
        var chimeraUrl = this.state.selectedExportUrl;
        if (!chimeraUrl) {
            return;
        }

        queryUrl = chimeraUrl + "/scenario/?filter=" + this.props.scenario.name;
        console.log("queryUrl: ", queryUrl);

        $.getJSON(queryUrl, function (data) {
            console.log("response data: ", data);
            if (data.length == 0) {
                this.setState({
                    deployedScenarioId: "",
                    deployedScenarioName: "not found"
                });
            } else if (data.length == 1) {
                this.setState({
                    deployedScenarioId: data[0].id,
                    deployedScenarioName: data[0].name
                }, this.fetchCaseInstances);
            } else {
                this.setState({
                    deployedScenarioId: "",
                    deployedScenarioName: "multiple matches"
                });
            }
        }.bind(this));
    },
    fetchCaseInstances: function () {
        var chimeraUrl = this.state.selectedExportUrl;
        if (!chimeraUrl) {
            console.log("Chimera URL not valid");
            return;
        }

        if (!this.state.deployedScenarioId) {
            console.log("Deployed scenario id not valid");
            return;
        }

        queryUrl = chimeraUrl + "/scenario/" + this.state.deployedScenarioId + "/instance";
        console.log("queryUrl: ", queryUrl);

        $.getJSON(queryUrl, function (data) {
            console.log("response data: ", data);
            selectedCaseInstanceId = '';
            if (data[0].id) {
                selectedCaseInstanceId = data[0].id;
            }
            this.setState({
                caseInstances: data,
                selectedCaseInstanceId: selectedCaseInstanceId
            });
        }.bind(this));
    },
    handleSelectedCaseInstanceChanged: function (index, value) {

        selectedCaseInstanceId = caseInstances[index];
        console.log(index, value, selectedCaseInstanceId);

        this.setState({ selectedCaseInstanceId: selectedCaseInstanceId });
    },
    submitComplianceQuery: function (query) {
        if (!query) {
            console.log("empty query");
            return;
        }

        var chimeraUrl = this.state.selectedExportUrl;
        if (!chimeraUrl) {
            console.log("no chimera url");
            return;
        }

        if (!this.state.deployedScenarioId) {
            console.log("scenario not deployed");
            return;
        }

        if (!this.state.selectedCaseInstanceId) {
            console.log("no case instance selected");
            return;
        }

        // API.checkCompliance(this.props.scenario, this.state.deployedScenarioId, this.state.selectedCaseInstanceId, query, function(data) {
        //     console.log("response data: ", data);
        //     this.setState({ complianceResult: data });
        // }.bind(this));

        queryUrl = chimeraUrl + "/scenario/" + this.state.deployedScenarioId + "/instance/" + this.state.selectedCaseInstanceId + "/compliance/" + query;
        console.log("queryUrl: ", queryUrl);

        $.ajax({
            url: queryUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(this.props.scenario)
        }).done(function(data) {
            console.log("response data: ", data);
            this.setState({ complianceResult: data });
        }.bind(this));
    },
    render: function () {
        var chimeraInstances = [].concat(this.state.exports.map(function (chimeraInstance) {
            return chimeraInstance.name;
        }));

        var caseInstanceList = [].concat(this.state.caseInstances.map(function (caseInstance) {
            return caseInstance.name;
        }));

        var selectedCaseInstanceName = this.state.caseInstances.find(function (caseInstance) {
            return caseInstance.id == this.state.selectedCaseInstanceId;
        }.bind(this));

        return (
            <form className="form-horizontal">
                <h3>Checking compliance</h3>

                <row>
                    <div className="col-md-2">
                        Chimera instance:
                    </div>

                    <div className="col-md-4">
                        <Dropdown
                            id="chimeraInstances"
                            handleSelectionChanged={this.handleSelectedExportChanged}
                            options={chimeraInstances}
                            selectedValue={this.state.selectedExportName}
                        />
                    </div>

                    <div className="col-md-1">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={this.fetchDeployedCaseModels}>
                            <i className={"fa fa-refresh"} />
                        </button>
                    </div>

                    <div className="col-md-5">
                        Deployed scenario id: {this.state.deployedScenarioId} ({this.state.deployedScenarioName})
                    </div>
                </row>

                <row>
                    <div className="col-md-2">
                        Case instance:
                    </div>

                    <div className="col-md-10">
                        <Dropdown
                            id="caseInstance"
                            handleSelectionChanged={this.handleSelectedCaseInstanceChanged}
                            options={caseInstanceList}
                            selectedValue={selectedCaseInstanceName}
                        />
                    </div>
                </row>

                <row>
                    <div className="col-md-12">
                        <ComplianceQuery handleChange={this.submitComplianceQuery} />
                    </div>
                </row>

                <row>
                    <div className="col-md-12">
                        <ComplianceResultDisplay complianceResult={this.state.complianceResult} />
                    </div>
                </row>

            </form>
        );
    }
});
module.exports = ComplianceCheckerComponent;
