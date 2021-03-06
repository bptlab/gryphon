var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var InputWithToggleComponent = require('./../inputwithtoggle');

var MapAnotherAttributeComponent = React.createClass({
  render: function() {
    return(
      <tr>
          <td></td>
          <td></td>
          <td>
            <button
                type="button"
                className="btn btn-link btn-sm"
                onClick={this.props.handleAdd}
            >
                <i className="fa fa-plus"></i> map another attribute
            </button>
          </td>
          <td></td>
          <td></td>
      </tr>
    );
  }
});

var MapAnotherDataClassComponent = React.createClass({
  render: function() {
    return(
      <tr>
          <td>
            <button
                type="button"
                className="btn btn-link btn-sm"
                onClick={this.props.handleAdd}
            >
                <i className="fa fa-plus"></i> map another data class
            </button>

            <a
              data-toggle="tooltip"
              title="If data classes are added to the mapping the case start trigger will create data objects of that classes in the specified lifecycle state."
            >
              <i className="fa fa-info-circle"></i>
            </a>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
      </tr>
    );
  }
});

var CaseStartTriggerRowComponent = React.createClass({
    getInitialState: function() {
        return {
            'disabled': true
        }
    },
    handleEditButtonClicked: function() {
      if (!this.state.disabled) {
        this.props.handleSubmit();
      }
      this.setState({disabled : !this.state.disabled});
    },
    render: function() {
        var dclass = (
            <input
                type="text"
                disabled="disabled"
                value={this.props.classname}
                className="form-control" />
        );
        if (this.props.enableClassSelect) {
            dclass = (
                <select className="form-control"
                        onChange={this.props.handleDataClassChange}
                        value={this.props.classname}
                        id={this.props._id + "-dtselect-class"}
                        disabled={this.state.disabled}
                        >
                    <option value="">Nothing</option>
                    {this.props.availableClasses}
                </select>
            );
        }
        var state = (
            <input
                type="text"
                disabled="disabled"
                value={this.props.state}
                id={this.props._id + "-dtselect-state"}
                className="form-control"
            />
        );
        if (this.props.enableClassSelect) {
            var availableStates = [];
            var classname = this.props.classname;
            if (this.props.classname in this.props.olcPaths) {
                availableStates = Object.keys(this.props.olcPaths[this.props.classname]);
            }

            state = (
                <select className="form-control"
                    onChange={this.props.handleStateChange}
                    value={this.props.state}
                    id={this.props._id + "-dtselect-state"}
                    disabled={this.state.disabled}
                    className="form-control"
                >
                    <option value="">Nothing</option>
                    {availableStates.map((statename) => {
                        return <option value={statename} key={"availableStates_" + classname + "_" + statename}>{statename}</option>
                    })}
                </select>
            );
        }

        return (
            <tr key={this.props._id}>
                <td>
                    {dclass}
                </td>
                <td>
                    {state}
                </td>
                <td>
                    <select className="form-control"
                            onChange={this.props.handleAttrChange}
                            value={this.props.attr}
                            disabled={this.state.disabled}
                            >
                        <option value="">Nothing</option>
                        {this.props.availableAttributes}
                    </select>
                </td>
                <td>
                    <input type="text"
                           className="form-control"
                           value={this.props.path}
                           onChange={this.props.handlePathChange}
                           disabled={this.state.disabled}
                    />
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button type="button"
                            className="btn btn-success"
                            onClick={this.handleEditButtonClicked}>
                        <i className={"fa " + (this.state.disabled ? "fa-pencil" : "fa-check")} />
                    </button>
                    <button type="button"
                            className="btn btn-danger"
                            onClick={this.props.handleDelete}>
                        <i className="fa fa-times" />
                    </button>
                  </div>
                </td>
            </tr>
        )
    }
});

var CaseStartTriggerComponent = React.createClass({
    getDefaultProps: function() {

    },
    getInitialState: function() {
        return {
            'collapsed': 'in'
        }
    },
    handleCollapse: function() {
        var collapsed = this.state.collapsed == '' ? 'in' : '';
        this.setState({'collapsed':collapsed})
    },
    handleEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.props.handleSubmit()
        }
    },
    handleQueryChange: function(e) {
        var condition = this.props.condition;
        condition['query'] = e.target.value;
        this.props.handleUpdate(condition);
    },
    handleClassAttrChange: function(index, attr) {
        return function(e) {
            var condition = this.props.condition;
            condition['dataclasses'][index][attr] = e.target.value;
            this.props.handleUpdate(condition);
        }.bind(this)
    },
    handleClassMappingChange: function(index, tindex, attr) {
        return function(e) {
            var condition = this.props.condition;
            condition['dataclasses'][index]['mapping'][tindex][attr] = e.target.value;
            this.props.handleUpdate(condition);
        }.bind(this)
    },
    handleAdd: function(index) {
        return function(e) {
            console.log('handleAdd');
            var condition = this.props.condition;
            condition['dataclasses'][index]['mapping'].push({'attr':'','path':''});
            this.props.handleUpdate(condition);
        }.bind(this)
    },
    handleDelete: function(index, tindex) {
        return function(e) {
            var condition = this.props.condition;
            if (condition['dataclasses'][index]['mapping'].length == 1) {
                condition['dataclasses'].splice(index, 1);
            } else {
                condition['dataclasses'][index]['mapping'].splice(tindex,1);
            }
            this.props.handleUpdate(condition);
            this.props.handleSubmit();
        }.bind(this)
    },
    handleAddClass: function() {
        var condition = this.props.condition;
        condition['dataclasses'].push({
            'classname': '',
            'state': '',
            'mapping': [{'attr':'','path':''}]
        });
        this.props.handleUpdate(condition);
    },
    render: function() {
        var availableClasses = this.props.availableClasses.map(function(dmclass){
            return (
                <option value={dmclass.name} key={"availableClasses" + dmclass.name}>{dmclass.name}</option>
            )
        });

        var rows = [];
        this.props.condition.dataclasses.forEach(function(dclass, index) {
            if (dclass.mapping.length == 0) {
                dclass.mapping.push({
                    "attr":"",
                    "path":""
                })
            }
            dclass.mapping.forEach(function(tuple,tindex){
                var enableClassSelect = false;
                if (tindex == 0) {
                    enableClassSelect = true;
                }
                var dmclasses = this.props.availableClasses.filter(function(dmclass){
                    return (dmclass.name == dclass.classname)
                });
                var availableAttributes = [];
                if (dmclasses.length == 1) {
                    availableAttributes = dmclasses[0].attributes.map(function(attr){
                        return (
                            <option value={attr.name} key={"availableAttributes" + attr.name}>{attr.name}</option>
                        )
                    })
                }
                rows.push((
                    <CaseStartTriggerRowComponent
                        enableClassSelect = {enableClassSelect}
                        handleSubmit = {this.props.handleSubmit}
                        handleDataClassChange = {this.handleClassAttrChange(index,'classname')}
                        handleStateChange = {this.handleClassAttrChange(index,'state')}
                        handleAttrChange = {this.handleClassMappingChange(index, tindex, 'attr')}
                        handlePathChange = {this.handleClassMappingChange(index, tindex, 'path')}
                        handleAdd = {this.handleAdd(index)}
                        handleDelete = {this.handleDelete(index,tindex)}
                        classname = {dclass.classname}
                        state = {dclass.state}
                        attr = {tuple.attr}
                        path = {tuple.path}
                        availableClasses = {availableClasses}
                        olcPaths = {this.props.olcPaths}
                        availableAttributes = {availableAttributes}
                        key = {tuple._id}
                    />
                ));
            }.bind(this))

            rows.push(
              <MapAnotherAttributeComponent
                handleAdd = {this.handleAdd(index)}
                key = {"MapAnotherAttributeComponent" + index}
              />
            );

        }.bind(this));

        rows.push(
          <MapAnotherDataClassComponent
            handleAdd = {this.handleAddClass}
          />
        );

        var btntext = this.state.collapsed == '' ? 'Show' : 'Hide';
        return (
            <div className="panel panel-default">
                <div className={"panel-collapse collapse " + this.state.collapsed} id={"CaseStartTriggerPanel" + this.props.id}>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-md-12">

                              <InputWithToggleComponent
                                initialValue={this.props.condition.query}
                                placeholder="New Event Query"
                                label="Event Query"
                                tooltip="This Esper EPL query will be registered with Unicorn. When a matching event occurs, the case start trigger will be triggered and instantiate a new case."
                                deletable={false}
                                handleChange={this.handleQueryChange}
                                handleSubmit={this.props.handleSubmit}
                                key={"CaseStartTriggerInput" + this.props.id}
                              />

                            </div>
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Data Class</th>
                            <th>State</th>
                            <th>Attribute</th>
                            <th>
                              JSON Path Expression
                              &nbsp;
                              <a
                                data-toggle="tooltip"
                                title="The JsonPath expression is applied to the event matching the event query and the resulting values are stored in the specified data object attributes."
                              >
                                <i className="fa fa-info-circle"></i>
                              </a>
                            </th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
                    </table>
                    <div className="panel-footer">
                      <div className="row">
                        <div className="col-md-12">
                          <button type="button" className="btn btn-danger pull-right" onClick={this.props.handleDelete} > Delete </button>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        );
    }
});

var ScenarioCaseStartTriggerForm = React.createClass({
    getInitialState: function() {
        return {
            'startconditions':[],
            '_id':'',
            'olcPaths' : {}
        }
    },
    handleUpdate: function(index){
        return function(obj) {
            var startconditions = this.state.startconditions;
            startconditions[index] = obj;
            this.setState({
                'startconditions':startconditions
            })
        }.bind(this)
    },
    componentDidUpdate: function() {
        if (this.state._id != this.props.scenario._id && this.props.scenario._id != undefined) {
            this.setState(
                {
                    '_id':this.props.scenario._id,
                    'startconditions':this.props.scenario.startconditions,
                },
                this.loadOLCPaths
            );
        }
    },
    loadOLCPaths: function() {
      API.loadOLCPaths(this.props.scenario.domainmodel._id,function(data){
          this.setState({olcPaths: data});
      }.bind(this));
    },
    handleSubmit: function() {
        API.exportScenario(this.state);
        MessageHandler.handleMessage("success","Saved case start triggers!");
    },
    handleAdd: function() {
        var conds = this.state.startconditions;
        conds.push({
            'query':'',
            'dataclasses':[]
        });
        this.setState({
            'startconditions':conds
        })
    },
    handleDelete: function(index){
        return function() {
            var startconditions = this.state.startconditions;
            startconditions.splice(index,1);
            this.setState({
                'startconditions':startconditions
            }, this.handleSubmit);
        }.bind(this)
    },
    render: function() {
        var conditions = this.state.startconditions.map(function(condition,index){
            var id = "CaseStartTrigger" + index;
            return (
                <CaseStartTriggerComponent
                    condition={condition}
                    handleUpdate={this.handleUpdate(index)}
                    availableClasses={this.props.scenario.domainmodel.dataclasses}
                    olcPaths={this.state.olcPaths}
                    handleSubmit={this.handleSubmit}
                    handleDelete={this.handleDelete(index)}
                    key={id}
                />
            )
        }.bind(this));
        return (
          <div>
            <div className="row">
              <div className="col-md-12">
                <h3>Case Start Trigger</h3>
                {conditions}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <button
                    type="button"
                    className="btn btn-link btn-sm"
                    onClick={this.handleAdd}
                >
                    <i className="fa fa-plus"></i> add case start trigger
                </button>

                <a
                  data-toggle="tooltip"
                  title="Case start triggers automatically instantiate cases whenever a specified external event occurs."
                >
                  <i className="fa fa-info-circle"></i>
                </a>
              </div>
            </div>
          </div>
        )
    }
});
module.exports = ScenarioCaseStartTriggerForm;
