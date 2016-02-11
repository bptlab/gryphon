var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../editor');
var API = require('./../api');
var MessageHandler = require('./../messagehandler');
var MessageComponent = require('./messagebar').MessageComponent;
var Link = require('react-router').Link;

var ExportTargetComponent = React.createClass({
    getInitialState: function() {
        return {
            name: "",
            url: ""
        }
    },
    handleUpdate: function() {
        API.validateExport(this.state.url,function(response){
            console.log(response);
            MessageHandler.handleMessage(response.type,response.text);
        });
        if (this.props.deletable == true) {
            API.updateExport(this.props.id,this.state.name,this.state.url,function(response){
                MessageHandler.handleMessage("success","Saved export!");
                this.props.onUpdate();
            }.bind(this));
        } else {
            API.addExport(this.state.name,this.state.url,function(response){
                MessageHandler.handleMessage("success","Saved export!");
                this.props.onUpdate();
            }.bind(this));
        }
    },
    componentDidMount: function() {
        this.setState({name: this.props.name, url: this.props.url})
    },
    deleteExport: function() {
        API.deleteExport(this.props.id,function(response){
            MessageHandler.handleMessage("success","Removed export!");
            console.log('Start update!');
            this.props.onUpdate();
        }.bind(this));
    },
    handleNameChange: function(e) {
        this.setState({name: e.target.value});
    },
    handleURLChange: function(e) {
        this.setState({url: e.target.value});
    },
    render: function() {
        var delete_button = "";
        if (this.props.deletable === true) {
            delete_button = <button className="btn btn-danger" onClick={this.deleteExport} >Delete</button>
        }
        return (
            <tr>
                <td>
                    <input type="text" className="form-control" value={this.state.name} onChange={this.handleNameChange} />
                </td>
                <td>
                    <input type="text" className="form-control" value={this.state.url} onChange={this.handleURLChange} />
                </td>
                <td>
                    <div className="btn-group">
                        <button className="btn btn-success" onClick={this.handleUpdate} >Save</button>
                        {delete_button}
                   </div>
                </td>
            </tr>
        )
    }
});

var ExportConfigComponent = React.createClass({
    getInitialState: function() {
        return {
            exports: []
        }
    },
    updateData: function() {
        console.log('Starting update!');
        API.getAvailableExports(function(data){
            console.log('Update done!');
            console.log(data);
            this.setState({exports: data})
        }.bind(this))
    },
    componentDidMount: function() {
        $('#exportScenarioModal').modal('hide');
        this.updateData()
    },
    render: function() {
        var updateHandler = this.updateData;
        var rows = this.state.exports.map(function(ex){
            return <ExportTargetComponent name={ex.name} url={ex.url} id={ex._id} onUpdate={updateHandler} deletable={true}/>
        });
        return (
            <div className="col-md-12">
                <div className="panel panel-default">
                    <div className="panel-heading   ">
                        <h3 className="panel-title">Available Export-Targets</h3>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Target-Name</th>
                                <th>Target-Url</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                            <ExportTargetComponent name="" url="" onUpdate={this.updateData} deletable={false}/>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },
});

module.exports = ExportConfigComponent;