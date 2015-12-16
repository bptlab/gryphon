var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../editor');
var API = require('./../api');

var FragmentEditorComponent = React.createClass({
    getInitialState: function() {
        return {
            editor: null,
            fragment: null
        }
    },
    render: function() {
        return (
            <div className="fragmentEditor">
                <div className="upperRightButtons" id="upperRightButtons">
                    <button type="button" className="btn btn-success" onClick={this.saveDiagram} >Save</button>
                </div>
                <div className="canvas" id="fragment-canvas" />
            </div>
        )
    },
    componentDidMount: function() {
        var editor = new Editor($('#fragment-canvas'));
        this.setState({editor: editor});
        this.loadDiagram();
        setInterval(this.saveDiagram,1000*60);
    },
    loadDiagram: function() {
        API.getFragment(this.props.params.id,function(data) {
            this.setState({fragment: data});
            this.state.editor.openDiagram(data.content, function(err){
                console.log(err);
            });
        }.bind(this));
    },
    componentDidUpdate: function() {
        if (this.state.fragment._id != null && this.props.params.id != this.state.fragment._id) {
            this.saveDiagram();
            this.loadDiagram();
        }
    },
    saveDiagram: function() {
        if (this.state.editor !== null && this.state.fragment !== null) {
            this.state.editor.exportFragment(this.state.fragment, function(data){
                API.exportFragment(data, function(data, res){
                    console.log(data);
                });
            });
        }
    },
    componentWillUnmount: function() {
        this.saveDiagram();
    }
});

module.exports = FragmentEditorComponent;