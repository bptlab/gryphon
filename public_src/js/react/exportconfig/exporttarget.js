var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');

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
module.exports = ExportTargetComponent;