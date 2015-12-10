var $ = jQuery = require('jquery');
window.$ = $;
var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var Bootstrap = require('bootstrap');
var API = require('./api');
var SideBarComponent = require('./react/sidebar');
var FragmentEditorComponent = require('./react/fragmenteditor');
var ScenarioEditorComponent = require('./react/scenarioeditor');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;


var App = React.createClass({
    getInitialState: function(){
        return {
            "controller": "",
            "pass": {},
            "currentScenario": {}
        }
    },
    switchPage: function(controller, pass) {
        this.setState({controller: controller});
    },
    loadScenario: function(id) {
        var scen = API.loadScenario(id);
        this.setState({currentScenario: scen, controller: ""});
    },
    renderPage: function(controller, params) {
        this.setState({controller: controller, })
    },
    render: function() {
        return (
            <div className="app-container">
                <SideBarComponent
                    scenarioLoader={this.loadScenario}
                    currentScenario={this.state.currentScenario}
                />
                <div className="main-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
});

//Handle the component routing. We might need another system here. This is one is ugly as fuck and mostly redundant.
//It does nothing but rendering the component needed and passing the props for the given component.
var MainComponent = React.createClass({
    render: function() {
        switch (this.props.controller) {
            case "domainmodel":
                return (
                    <div className="main-content">
                        <DomainModelEditorComponent {...this.props.pass} />
                    </div>
                );
                break;
            case "fragment":
                return (
                    <div className="main-content-bpmn">
                        <FragmentEditorComponent {...this.props.pass} />
                    </div>
                );
                break;
            case "scenario":
                return (
                    <div className="main-content">
                        <ScenarioEditorComponent {...this.props.pass} />
                    </div>
                );
                break;
            default:
                return (
                    <div className="main-content">

                    </div>
                );
                break;
        }
    }
});

$(function () {

    ReactDOM.render(
        <Router>
            <Route path="/" component={App}>
                <Route path="scenario/:id" component={ScenarioEditorComponent} />
                <Route path="fragment/:id" component={FragmentEditorComponent} />
            </Route>
        </Router>,
        document.getElementById('app-container')
    );

    var links = $('.sidebar-links > div');
    //links.on('click', function () {
    //    links.removeClass('selected');
    //    $(this).addClass('selected');
    //});
});