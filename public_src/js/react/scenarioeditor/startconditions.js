var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');

var ScenarioSingleStartCondition = React.createClass({
    getInitialState: function() {
        return {
            'collapsed': ''
        }
    },
    handleDataClassChange: function(index) {
        return function(e) {
            var new_mapping = this.props.mapping;
            new_mapping[index]['classname'] = e.target.value;
            new_mapping[index]['attr'] = '';
            this.props.handleChange({'mapping':new_mapping,'query': this.props.query});
        }.bind(this)
    },
    handleDataClassAttrChange: function(index) {
        return function(e) {
            var new_mapping = this.props.mapping;
            new_mapping[index]['attr'] = e.target.value;
            this.props.handleChange({'mapping':new_mapping,'query': this.props.query});
        }.bind(this)
    },
    handleJSONPathChange: function(index) {
        return function(e) {
            var new_mapping = this.props.mapping;
            new_mapping[index]['path'] = e.target.value;
            this.props.handleChange({'mapping':new_mapping,'query': this.props.query});
        }.bind(this)
    },
    handleAdd: function() {
        var new_mapping = this.props.mapping;
        new_mapping.push({
            'path': '',
            'classname': '',
            'attr': ''
        });
        this.props.handleChange({'mapping':new_mapping,'query': this.props.query});
    },
    handleDelete: function(index) {
        return function(e) {
            var new_mapping = this.props.mapping;
            new_mapping.splice(index, 1);
            this.props.handleChange({'mapping':new_mapping,'query': this.props.query});
        }.bind(this)
    },
    handleStartConditionChange: function(e) {
        this.props.handleChange({'mapping':this.props.mapping, 'query': e.target.value})
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
    updateSelect: function() {
        console.log('Dont care');
        this.props.mapping.forEach(function(mapel){
            $('#' + mapel._id + "-dtselect-class").selectpicker();
            $('#' + mapel._id + "-dtselect-attr").selectpicker()
        });
    },
    render: function() {
        var mapping = this.props.mapping.map(function(mapel, index){
            var dmclass = this.props.availableClasses.filter(function(dmclass){
                return dmclass.name == mapel.classname;
            });

            var availableClasses = this.props.availableClasses.map(function(dmclass){
                return (
                    <option value={dmclass.name}>{dmclass.name}</option>
                )
            });

            var availableAttributes = [];
            if (dmclass.length == 1) {
                availableAttributes = dmclass[0].attributes.map(function(attr){
                    return (
                        <option value={attr.name}>{attr.name}</option>
                    )
                })
            }
            return (
                <tr key={mapel._id}>
                    <td>
                        <select className="form-control" onChange={this.handleDataClassChange(index)} value={mapel.classname} id={mapel._id + "-dtselect-class"}>
                            <option value="">Nothing</option>
                            {availableClasses}
                        </select></td>
                    <td>
                        <select className="form-control" onChange={this.handleDataClassAttrChange(index)} value={mapel.attr} id={mapel._id + "-dtselect-attr"}>
                            <option value="">Nothing</option>
                            {availableAttributes}
                        </select></td>
                    <td>
                        <input type="text"
                               onKeyDown={this.handleEnterSubmit}
                               className="form-control"
                               onChange={this.handleJSONPathChange(index)}
                               value={mapel.jsonpath}
                        />
                    </td>
                    <td>
                        <button type="button" className="btn btn-danger" onClick={this.handleDelete(index)}><i className="fa fa-times" /></button>
                    </td>
                </tr>
            )
        }.bind(this));
        var btntext = this.state.collapsed == '' ? 'Show' : 'Hide';
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Startcondition
                        <button type="button" className="btn btn-xs pull-right" onClick={this.handleCollapse}>{btntext}</button>
                        <button type="button" className="btn btn-xs pull-right btn-danger" onClick={this.props.handleDelete}><i className="fa fa-times" /></button>
                    </h3>
                </div>
                <div className={"panel-collapse collapse " + this.state.collapsed} id={"StartConditionPanel" + this.props.id}>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-sm-12">
                                <input type="text"
                                       className="form-control"
                                       onChange={this.handleStartConditionChange}
                                       value={this.props.query}
                                       onKeyDown={this.handleEnterSubmit}
                                />
                            </div>
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Dataclass</th>
                            <th>Attribute</th>
                            <th>JSON-Path</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mapping}
                        </tbody>
                    </table>
                    <div className="panel-footer">
                        <button type="button" className="btn btn-primary" onClick={this.handleAdd} >Add new</button>
                    </div>
                </div>
            </div>
        );
    }
});

var ScenarioStartConditionForm = React.createClass({
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
        MessageHandler.handleMessage("success","Saved startconditions!");
    },
    handleAdd: function() {
        var conds = this.state.startconditions;
        conds.push({
            'query':'',
            'mapping':[{'attr':'','classname':'','path':''}]
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
            return (
                <ScenarioSingleStartCondition
                    id={condition._id}
                    mapping={condition.mapping}
                    query={condition.query}
                    handleChange={this.handleUpdate(index)}
                    availableClasses={this.props.scenario.domainmodel.dataclasses}
                    handleSubmit={this.handleSubmit}
                    handleDelete={this.handleDelete(index)}
                />
            )
        }.bind(this));
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Start-Conditions</h3>
                </div>
                <div className="panel-body">
                    <div className="panel-group">
                        {conditions}
                    </div>
                </div>
                <div className="panel-footer clearfix">
                    <div className="btn-group pull-right">
                        <button type="button" className="btn btn-primary" onClick={this.handleSubmit} >Submit</button>
                        <button type="button" className="btn btn-primary" onClick={this.handleAdd} >Add new</button>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = ScenarioStartConditionForm;