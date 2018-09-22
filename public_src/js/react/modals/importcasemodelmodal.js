var React = require('react');
var API = require('./../../api');
var NameCheck = require('./../../namecheck');
var SideBarManager = require('./../../sidebarmanager');
var Redirecter = require('./../../redirecter');
var MessageHandler = require('./../../messagehandler');

var ImportCaseModelModal = React.createClass({
    getInitialState: function() {
        return {
            file: '',
            content: ''
        }
    },
    handleSubmit: function(e) {
        if (NameCheck.check(this.state.content.name)) {
            API.importCaseModel(this.state.content, function(data){
                if ("err_code" in data) {
                    MessageHandler.handleMessage(data.type, data.text);
                } else {
                    SideBarManager.reload();
                    Redirecter.redirectToScenario(data.responseJSON._id);
                }
            });
            $('#importCaseModelModal').modal('hide');
        }
    },
    handleFileChange: function(e) {
        var file = e.target.files[0];
        this.setState({file: file}, this.readFileContent);
    },
    readFileContent: function() {
        var reader = new FileReader();
        reader.onprogress = this.loadProgress;
        reader.onloadend = this.loaded;
        reader.onerror = this.loadError;
        reader.readAsText(this.state.file);
    },
    loaded: function(e) {
        document.body.style.cursor='default';
        var fileContent = e.target.result;
        try {
            var content = JSON.parse(fileContent);
            this.setState({content: content});
        } catch(e) {
            this.setState({content: ''});
            MessageHandler.handleMessage('danger', 'The file does not contain a valid Json object.');
        }
    },
    loadProgress: function(e) {
        document.body.style.cursor='wait';
    },
    loadError: function(e) {
        document.body.style.cursor='default';
        MessageHandler.handleMessage('danger', 'A problem occured during the upload.');
    },
    handleNameChange: function(e) {
        var content = this.state.content;
        content.name = e.target.value;
        this.setState({content: content});
    },
    handleNameEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.handleSubmit();
        }
    },
    render: function() {
        const changeCaseModelName = this.state.content ?
            <div>
                <br />
                <label htmlFor="importCaseModelModalName">Case Model Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="importCaseModelModalName"
                    placeholder="Enter case model name"
                    value={this.state.content.name}
                    onChange={this.handleNameChange}
                    onKeyDown={this.handleNameEnterSubmit}
                />
            </div>
            : '';
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="importCaseModelModalTitle" id="importCaseModelModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="importCaseModelModalTitle">Import a case model</h4>
                            </div>
                            <div className="modal-body">
                                <fieldset className="form-group">
                                    <input
                                        type="file"
                                        accept=".json"
                                        className="form-control"
                                        id="importCaseModelModalFile"
                                        onChange={this.handleFileChange}
                                    />
                                    {changeCaseModelName}
                                </fieldset>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn" data-dismiss="modal">Close</button>
                                <button
                                    type="button"
                                    className="btn btn-default btn-primary"
                                    onClick={this.handleSubmit}
                                    disabled={!this.state.content}
                                >
                                    Import
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = ImportCaseModelModal;
