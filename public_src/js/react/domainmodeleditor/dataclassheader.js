var React = require('react');
var TypeSelect = require('./typeselect');

var DataClassHeaderComponent = React.createClass({
    render: function() {
        return (
            <div className="panel-heading clearfix">
                <div className="row">
                    <div className="col-sm-8 col-md-6 col-lg-4">
                        <TypeSelect
                            is_event={this.props.is_event}
                            is_resource={this.props.is_resource}
                            resource_id={this.props.resource_id}
                            availableResourceTypes={this.props.availableResourceTypes}
                            handleType={this.props.handleType}
                        />
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = DataClassHeaderComponent;