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
            if (data.scenarios) {
                this.setState({scenarios: data.scenarios});
            }
        }.bind(this))
    },
    render: function() {
        var scenarios = this.state.scenarios.map(function(scenario){
            return (
                <div className="col-md-2">
                <Link to={"scenario/" + scenario._id}>
                    {scenario.name}
                </Link>
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

                <div className="row">
                  {scenarios}
                </div>

              </div>

            </div>
        )
    }
});

module.exports = IndexComponent;
