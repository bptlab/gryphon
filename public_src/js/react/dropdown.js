var React = require('react');

var DropdownComponent = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentDidMount: function() {
        // update dropdown
        $('#' + this.getSelectId()).selectpicker('refresh');
    },
    componentWillReceiveProps: function(newProps) {
    },
    componentDidUpdate: function() {
        // update dropdown
        $('#' + this.getSelectId()).selectpicker('refresh');


    },
    handleSelectionChanged: function(e) {
        console.log("Dropdown handleSelectionChanged ", e.target.selectedIndex, e.target.value);
        if (this.props.handleSelectionChanged) {
            this.props.handleSelectionChanged(e.target.selectedIndex, e.target.value);
        } else {
            console.log("Dropdown has no handleSelectionChanged(index, value) prop");
        }
    },
    getSelectId: function() {
        if(!this.props.id) {
            console.log("Dropdown has no id prop");
        }
        return this.props.id + "-select";
    },
    render: function() {

        var options = [];
        options = options.concat(this.props.options.map(function(option){
            var value = option;
            var key = "option_" + value;
            return (
                <option value={value} key={key}>{value}</option>
            )
        }));

        return(
            <select
                className="selectpicker"
                onChange={this.handleSelectionChanged}
                value={this.props.selectedValue}
                data-live-search="true"
                id={this.getSelectId()}>
                    {options}
            </select>
        );
    }
});
module.exports = DropdownComponent;