var React = require('react');
var Link = require('react-router').Link;
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');

var ScenarioFragmentList = React.createClass({
    getInitialState: function() {
        return {
            newname: ''
        };
    },
    handleNameChange: function(e) {
        this.setState({newname: e.target.value})
    },
    handleFragmentClick: function(e) {
        var newItem = this.state.newname;
        if (NameCheck.check(newItem) &&
            NameCheck.isUnique(newItem, this.props.scenario.fragments)) {
            API.createFragment(newItem,function(data, res){
                API.associateFragment(this.props.scenario._id,data._id,function(data, res){
                    this.setState({newname: ''});
                    MessageHandler.handleMessage('success', 'Added new fragment!');
                    this.props.forceRerender();
                }.bind(this));
            }.bind(this));
        }
    },
    handleEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.handleFragmentClick(e)
        }
    },
    render: function() {
        var fragments = this.props.scenario.fragments.map(function(fragment) {
            return (
                <li key={fragment._id} className="list-group-item"><Link to={"fragment/" + fragment._id}>{fragment.name}</Link></li>
            );
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Fragments</div>
                <div className="panel-body">
                    <p>All scenario fragments.</p>
                </div>
                <ul className="list-group">
                    {fragments}
                </ul>
                <div className="panel-footer clearfix">
                    <div className="input-group pull-right">
                        <input type="text"
                               className="form-control"
                               name="newfragmentname"
                               onChange={this.handleNameChange}
                               placeholder="New fragment"
                               value={this.state.newname}
                               onKeyDown={this.handleEnterSubmit}
                        />
                        <span className="input-group-btn">
                            <button className="btn btn-success" type="button" onClick={this.handleFragmentClick}>
                                <i className="fa fa-plus" /> Add fragment
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioFragmentList;