var xml2json = require('xml2json')
/**
 * This function takes xml conform to the bpmn.io xml standard and parses it to an serialisable and analyzable
 * object structure using the bpmn-moddle library. For further information see bpmn-moddle and bpmn-io documentation.
 * @param xml
 */
var parseToBPMNObject = function (xml) {

    xml = xml.replace(/<bpmn:/g,'<');
    xml = xml.replace(/<bpmndi:/g,'<');
    xml = xml.replace(/<di:/g, '<');
    xml = xml.replace(/<dc:/g, '<');


    xml = xml.replace(/<\/bpmn:/g,'</');
    xml = xml.replace(/<\/bpmndi:/g,'</');
    xml = xml.replace(/<\/di:/g, '</');
    xml = xml.replace(/<\/dc:/g, '</');

    xml = xml.replace(/ xsi:/g, ' ');

    var options = {
        object: true,
        reversible: false,
        coerce: false,
        sanitize: true,
        trim: true,
        arrayNotation: true
    };

    var parsed = xml2json.toJson(xml, options)

    return parsed.definitions[0].process[0];
};

module.exports = {parseToBPMNObject: parseToBPMNObject}
