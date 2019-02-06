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
                            handleType={this.props.handleType}
                        />
                    </div>
                    <div className="col-sm-1">
                      <a
                        data-toggle="tooltip"
                        data-container="body"
                        title="Data classes store information available in a case. Event classes specify expected external events and are registered with Unicorn."
                      >
                        <i className="fa fa-info-circle"></i>
                      </a>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = DataClassHeaderComponent;