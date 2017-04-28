var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');

var CaseStartTriggerRowComponent = React.createClass({
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
                        id={this.props._id + "-dtselect-class"}>
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
                className="form-control" />
        );
        if (this.props.enableClassSelect) {
            state = (
                <input type="text"
                       className="form-control"
                       value={this.props.state}
                       onChange={this.props.handleStateChange} />
            )
        }
        var btn = "";
        if (this.props.enableClassSelect) {
            btn = (
                <button type="button"
                        className="btn btn-success"
                        onClick={this.props.handleAdd}>
                    <i className="fa fa-plus" />
                </button>
            )
        } else {
            btn = (
                <button type="button"
                        className="btn btn-danger"
                        onClick={this.props.handleDelete}>
                    <i className="fa fa-times" />
                </button>
            )
        }
        return (
            <tr key={this.props._id} className="info">
                <td>
                    {dclass}
                </td>
                <td>
                    {state}
                </td>
                <td>
                    <select className="form-control"
                            onChange={this.props.handleAttrChange}
                            value={this.props.attr}>
                        <option value="">Nothing</option>
                        {this.props.availableAttributes}
                    </select>
                </td>
                <td>
                    <input type="text"
                           className="form-control"
                           value={this.props.path}
                           onChange={this.props.handlePathChange}
                    />
                </td>
                <td>
                    {btn}
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
            console.log('lel');
            var condition = this.props.condition;
            condition['dataclasses'][index]['mapping'][tindex][attr] = e.target.value;
            this.props.handleUpdate(condition);
        }.bind(this)
    },
    handleAdd: function(index) {
        return function(e) {
            console.log('lel');
            var condition = this.props.condition;
            condition['dataclasses'][index]['mapping'].push({'attr':'','path':''});
            this.props.handleUpdate(condition);
        }.bind(this)
    },
    handleDelete: function(index, tindex) {
        return function(e) {
            var condition = this.props.condition;
            condition['dataclasses'][index]['mapping'].splice(tindex,1);
            this.props.handleUpdate(condition);
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
                <option value={dmclass.name}>{dmclass.name}</option>
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
                            <option value={attr.name}>{attr.name}</option>
                        )
                    })
                }
                console.log(tuple);
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
                        availableAttributes = {availableAttributes}
                    />
                ))
            }.bind(this))
        }.bind(this));
        var btntext = this.state.collapsed == '' ? 'Show' : 'Hide';
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Case start trigger
                        <button type="button" className="btn btn-xs pull-right" onClick={this.handleCollapse}>{btntext}</button>
                        <button type="button" className="btn btn-xs pull-right btn-danger" onClick={this.props.handleDelete}><i className="fa fa-times" /></button>
                    </h3>
                </div>
                <div className={"panel-collapse collapse " + this.state.collapsed} id={"CaseStartTriggerPanel" + this.props.id}>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-sm-12">
                                <input type="text"
                                       className="form-control"
                                       onChange={this.handleQueryChange}
                                       value={this.props.condition.query}
                                       onKeyDown={this.handleEnterSubmit}
                                />
                            </div>
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Dataclass</th>
                            <th>State</th>
                            <th>Attribute</th>
                            <th>JSON-Path</th>
                            <th>Operations</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
                    </table>
                    <div className="panel-footer">
                        <button type="button" className="btn btn-primary" onClick={this.handleAddClass} >Add new</button>
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
            '_id':''
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
                    'startconditions':this.props.scenario.startconditions
                }
            )
        }
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
            })
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
                <button
                    type="button"
                    className="btn btn-link btn-sm"
                    onClick={this.handleSubmit}
                >
                    <i className="fa fa-plus"></i> save
                </button>
              </div>
            </div>
          </div>
        )
    }
});
module.exports = ScenarioCaseStartTriggerForm;
