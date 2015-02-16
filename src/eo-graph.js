(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return factory;
        });
    }else if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    }
    else {
        root['eo-graph'] = factory;
    }
})(this, function() { // jscs:disable validateIndentation
'use strict';

var graph = {};
var currentNode;
var currentNodeId;
var edges = [];
var version = 2;

var initGraph = function(object, root) {
    var initialNode;
    var error = false;

    graph = object;
    if (typeof graph === 'object' && graph.__version__ === version) {
        if (root !== undefined && graph.hasOwnProperty(root)) {
            initialNode = root;
        }
        else if (graph.hasOwnProperty('__root__')) {
            initialNode = graph.__root__;
        }
        else {
            console.error('Not root node found');
            error = true;
        }

        if (graph.hasOwnProperty(initialNode)) {
            currentNode = graph[initialNode];
            currentNode.id = initialNode;
        }
        else
        {
            console.error('Invalid root node');
            error = true;
        }
    }
    else {
        console.error('Invalid graph version');
        error = true;
    }

    return !error;
};

var matchByType = function(value, ruleName) {
    var validation = {
        msg: '',
        isValid: true,
        value: value
    };

    switch (ruleName) {
        case 'number':
            var validatedValue = Number(value);
            if (isNaN(validatedValue)) {
                validation.valid = false;
                validation.msg = 'The value is not a number';
            }
            else {
                validation.value = validatedValue;
            }
        break;
        default:
            validation.msg = 'Invalid rule name: ' + ruleName;
    }

    return validation;
};

var matchEdgesWithValue = function(value, edges) {
    var valueTested;
    var edge = null;

    for (var i = 0, len = edges.length; i < len; i++) {
        if (typeof edges[i].match === 'object') {
            valueTested = matchByType(value, edges[i].match.type);
            if (valueTested.isValid) {
                edge =  {
                    edgeId: edges[i].next,
                    value: valueTested.value
                };
                break;
            }
            else {
                console.debug(valueTested.msg);
            }
        }
        else if (edges[i].value === value) {
            edge = {
                edgeId: edges[i].next,
                value: value
            };
            break;
        }
    }

    return edge;
};

var isTerminalNode = function(node) {
    if (node.edges && node.edges.length > 0) {
        return false;
    }
    return true;
};

var doNext = function(edge) {
    var nextNode;

    nextNode = graph[edge.edgeId];

    if (nextNode !== undefined) {
        edge.nodeId = currentNode.id;
        edges.push(edge);

        // Move to the next node
        currentNode = nextNode;
        currentNode.id = edge.edgeId;
    }
    else {
        console.error('No found nodes with id: ' + edge.edgeId);
    }

    return nextNode;
};

var doCurrent = function() {
    return currentNode;
};

var doPrev = function() {
    var edge;
    var prevNode;

    prevNode = null;
    edge = edges.pop();

    if (edge !== undefined) {
        currentNode = graph[edge.nodeId];
        prevNode = currentNode;
    }

    return currentNode;
};

var nextNode = function(value) {
    var nextNode;
    var edge;

    if (currentNode.edges !== undefined) {
        edge = matchEdgesWithValue(value, currentNode.edges);

        if (edge !== null) {
            nextNode = doNext({
                edgeId: edge.edgeId,
                value: edge.value
            });
        }
        else {
            console.error('No found edges with value id: ' + value);
        }
    }

    return nextNode;
};

var getEdges = function() {
    return edges;
};

var getValues = function() {
    return edges.map(function(edge) {
        return edge.value;
    });
};

var hasNext = function() {
    return !isTerminalNode(currentNode);
};

return {
    init: initGraph,
    next: nextNode,
    current: doCurrent,
    previous: doPrev,
    edges: getEdges,
    values: getValues,
    hasNext: hasNext
};

});
