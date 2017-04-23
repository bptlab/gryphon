var React = require('react');
var API = require('./../../api');
var ExportTargetComponent = require('./exporttarget');


var ExportConfigComponent = React.createClass({
    getInitialState: function() {
        return {
            exports: []
        }
    },
    updateData: function() {
        API.getAvailableExports(function(data){
            this.setState({exports: data})
        }.bind(this))
    },
    componentDidMount: function() {
        //$('#exportScenarioModal').modal('hide');
        this.updateData()
    },
    render: function() {
        var updateHandler = this.updateData;
        var rows = this.state.exports.map(function(ex){
            return <ExportTargetComponent name={ex.name} url={ex.url} id={ex._id} onUpdate={updateHandler} deletable={true}/>
        });
        return (
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
        )
    }
});

module.exports = ExportConfigComponent;
