var React = require('react');

var InstantiationPolicyComponent = React.createClass({
    getInitialState: function() {
        return {
            policy: "",
            hasBound: '',
            limit: '',
            _id: ''
        }
    },
    componentDidMount: function() {
        this.setState({
            policy: this.props.fragment.policy,
            hasBound: this.props.fragment.bound.hasBound,
            limit: this.props.fragment.bound.limit,
            _id: this.props.fragment._id
          });
    },
    componentDidUpdate: function() {
        if (this.props.fragment._id != this.state._id) {
            this.setState({
                policy: this.props.fragment.policy,
                hasBound: this.props.fragment.bound.hasBound,
                limit: this.props.fragment.bound.limit,
                _id: this.props.fragment._id
            });
        }
    },
    handlePolicyChange: function(event) {
        var newPolicy = event.target.value;
        this.setState({policy: newPolicy});
        this.props.changePolicy(newPolicy);
    },
    handleBoundChange: function(event) {
          const target = event.target;
          const value = target.type === 'checkbox' ? target.checked : parseInt(target.value);
          const name = target.name;
          this.setState({
              [name]: value
          }, this.submitBound);
    },
    submitBound() {
        	console.log(this.state.limit);
          const bound = {
            hasBound: this.state.hasBound,
            limit: this.state.limit
          };
          this.props.handleBoundChange(bound);
    },
    render: function() {
      const instantiationPolicyBehavior = ["sequential", "concurrent"].map(function(b){
        var key="policyBehavior_" + b;
        return (
          <option value={b} key={key}>{b}</option>
        )
      });
      const limit = this.state.hasBound ?
        <form className="form-inline">
          <label>
            Limit:&nbsp;
            <input
              name="limit"
              className="form-control"
              type="number"
              min="1"
              pattern="^[0-9]*"
              value={this.state.limit}
              onChange={this.handleBoundChange} />
          </label>
        </form>
        : '';
      const checkboxClassName = this.state.hasBound ? "col-sm-2 checkbox" : "col-sm-2 checkbox";
      return (
        <form className="form-horizontal">
          <h3>Instantiation Policy</h3>
          <div className="row">
            <div className="col-sm-5">
              <select className="form-control"
                onChange={this.handlePolicyChange}
                value={this.state.policy}
                id={this.props.fragment.name + "-bselect"}>
                  {instantiationPolicyBehavior}
              </select>
            </div>
            <a
              white-space="pre-line"
              data-toggle="tooltip"
              title='Sequential: create a new fragment instance every time the end event is reached. Concurrent: create a new fragment instance every time an instance is active, e.g. a Human Task was started.'
            >
              <i className="fa fa-info-circle"></i>
            </a>
          </div>
          <br />
          <div className="row">
            <div className="col-sm-2 checkbox">
              <label>
                <input
                      name="hasBound"
                      type="checkbox"
                      checked={this.state.hasBound}
                      onChange={this.handleBoundChange}
                  />
              Define Bound
              </label>
              &nbsp;
              <a
                data-toggle="tooltip"
                title="If no bound is defined infinite fragment instances can be created."
              >
                <i className="fa fa-info-circle"></i>
              </a>
            </div>
            {limit}
          </div>
        </form>
      )
    }
});

module.exports = InstantiationPolicyComponent;
