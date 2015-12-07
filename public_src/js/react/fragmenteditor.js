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
        return (<div className="canvas" id="fragment-canvas"></div>)
    },
    componentDidMount: function() {
        var editor = new Editor($('#fragment-canvas'));
        this.setState({editor: editor});
        API.getFragment(this.props.params.id,function(data) {
            console.log(data.toString());
            console.log(typeof data);
            this.setState({fragment: data});
            editor.openDiagram(data.content, function(err){
                console.log(err);
            });
        }.bind(this));
        setInterval(this.saveDiagram,1000*60*3);
    },
    saveDiagram: function() {
        if (this.state.editor !== null && this.state.fragment !== null) {
            this.state.editor.exportFragment(this.state.fragment, function(err){
                console.log(err);
            });
        }
    },
    componentWillUnmount: function() {
        this.saveDiagram();
    }
});

module.exports = FragmentEditorComponent;