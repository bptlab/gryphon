var React = require('react');

var TopBarComponent = React.createClass({
    render: function() {
        return (
            <div className="row">
              <a href="#">
                <img src="./img/hpi.png" alt="HPI" style={{width:'100px',height:'100px'}} />
              </a>
              <span className="h1">{this.props.scenario.name}</span>
              <span className="h2"> / Subitem Name</span>
              <hr />
            </div>
        )
    }
});

module.exports = TopBarComponent;
