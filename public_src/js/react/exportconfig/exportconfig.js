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
    }
});

module.exports = ExportConfigComponent;