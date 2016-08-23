var React = require('react');
var Link = require('react-router').Link;
var API = require('./../api');

var IndexComponent = React.createClass({
    getInitialState: function() {
        return {
            scenarios: []
        }
    },
    componentDidMount: function() {
        this.loadScenarioList();
    },
    loadScenarioList: function() {
        API.getAllScenarios(true, function(data) {
            if (data) {
                this.setState({scenarios: data});
            }
        }.bind(this))
    },
    render: function() {
        var scenarioArray = [[]];
        var row = 0;
        var col = 0;
        var maxCols = 4;
        this.state.scenarios.forEach(function(scenario) {
          scenarioArray[row].push(scenario);
          col++;
          if (col >= maxCols) {
            scenarioArray.push([]);
            row++;
            col = 0;
          }
        });

        var scenarios = scenarioArray.map(function(scenarioRow, i) {

          var scenarioCols = scenarioRow.map(function(scenario, j) {
            var key = "scenario_row_" + i + "_col_" + j;
            return (
              <div className="col-md-3" key={key}>
                <Link to={"scenario/" + scenario._id}>
                    {scenario.name}
                </Link>
              </div>
            )
          });

          var key = "scenario_row_" + i;
          return (
            <div className="row" key={key} >
              {scenarioCols}
            </div>
          )
        });

        return (
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-8">
                  <h1>Gryphon Case Modeler</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  About
                </div>
                <div className="col-md-3">
                  Getting Started
                </div>
              </div>

              <br/>
              <br/>

              <div className="panel panel-default">

                <div className="panel-heading">
                  <div className="row">
                    <div className="col-md-8">
                      <h2 className="panel-title">
                        Case Models
                      </h2>
                    </div>
                    <div className="col-md-4 pull-right">
                      <input type="text" defaultValue="Search Bar"/>
                    </div>
                  </div>
                </div>

                {scenarios}

                <div className="row">
                  <div className="col-md-2">
                    <a
                        href="#"
                        data-toggle="modal"
                        data-target="#createScenarioModal"
                    >
                        <i className="fa fa-plus"></i>Create a scenario
                    </a>
                  </div>
                </div>

              </div>

            </div>
        )
    }
});

module.exports = IndexComponent;
