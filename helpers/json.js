var xml2json = require('xml2json')
/**
 * This function takes xml conform to the bpmn.io xml standard and parses it to an serialisable and analyzable
 * object structure using the bpmn-moddle library. For further information see bpmn-moddle and bpmn-io documentation.
 * @param xml
 */
var parseToBPMNObject = function(xml) {

    // What am I doing here? I remove all namespaces to make parsing easier. All but the griffin notations.
    xml = xml.replace(/<bpmn:/g, '<');
    xml = xml.replace(/<bpmndi:/g, '<');
    xml = xml.replace(/<di:/g, '<');
    xml = xml.replace(/<dc:/g, '<');


    xml = xml.replace(/<\/bpmn:/g, '</');
    xml = xml.replace(/<\/bpmndi:/g, '</');
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

    var parsed = xml2json.toJson(xml, options);

    return parsed.definitions[0].process[0];
};

var parseToOLC = function(xml) {
    var parsed = parseToBPMNObject(xml);
    console.log(parsed);
    delete parsed["id"];
    delete parsed["isExecutable"];
    if ("task" in parsed) {
        parsed["state"] = parsed["task"].map(function(task){
            task.id = task.id.replace("Task","State");
            return task;
        });
        delete parsed["task"];
    }
    if ("sequenceFlow" in parsed) {
        parsed["sequenceFlow"] = parsed["sequenceFlow"].map(function(sequenceFlow){
            if ("sourceRef" in sequenceFlow) {
                sequenceFlow['sourceRef'] = sequenceFlow['sourceRef'].replace("Task","State");
            }
            if ("targetRef" in sequenceFlow) {
                sequenceFlow['targetRef'] = sequenceFlow['targetRef'].replace("Task","State");
            }
            return sequenceFlow;
        })
    }
    return parsed;
};

module.exports = {parseToBPMNObject: parseToBPMNObject,parseToOLC: parseToOLC};
