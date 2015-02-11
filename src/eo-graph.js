(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return factory();
        });
    }else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    }
    else {
        root['eo-graph'] = factory();
    }
})(this, function() { // jscs:disable validateIndentation
'use strict';

var graph = {};
var currentNode;
var edges = [];
var version = 2;

var initGraph = function(object, root) {
    graph = object;
    if (typeof graph === 'object' && graph.__version__ === version) {
        if (graph.hasOwnProperty(root)) {
            currentNode = graph[root];
        }
        else {
            console.error('Invalid root node');
        }
    }
    else {
        console.error('Invalid graph version');
    }

    return true;
};

var findEdgeByValue = function(value, edges) {
    for (var i = 0, len = edges.length; i < len; i++) {
        if (typeof edges[i].value === 'object') {
            if (typeof value === edges[i].value.type) {
                return edges[i].next;
            }
        }
        else if (edges[i].value === value) {
            return edges[i].next;
        }
    }
    return null;
};

var doNext = function(edge) {
    var nextNode;

    nextNode = graph[edge.edgeId];

    if (nextNode !== undefined) {
        edges.push(edge);
        currentNode = nextNode;
    }
    else {
        console.error('No found nodes with id: ' + edge.edgeId);
    }

    return nextNode;
};

var doCurrent = function() {
    return currentNode;
};

var doPrev = function(edgeId) {
    var indexOfLast;
    var lastEdge;

    indexOfLast = edges.length - 1;
    lastEdge = edges[indexOfLast];

    if (lastEdge === edgeId) {
        edges.pop(indexOfLast);
        currentNode = graph[edges[indexOfLast - 1].edgeId];
    }
    else {
        console.error('No found edges with id: ' + edgeId);
    }

};

var nextNode = function(value) {
    var nextNode;
    var edgeId;

    if (currentNode.edges !== undefined) {
        edgeId = findEdgeByValue(value, currentNode.edges);

        if (edgeId !== null) {
            nextNode = doNext({
                edgeId: edgeId,
                value: value
            });
        }
        else {
            console.error('No found edges with value id: ' + value);
        }
    }

    return nextNode;
};

var prevNode = function() {
    return doPrev(edges[edges.length - 1]);
};

var getEdges = function() {
    return edges;
};

var getValues = function() {
    return edges.map(function(edge) {
        return edge.value;
    });
};

return {
    init: initGraph,
    next: nextNode,
    current: doCurrent,
    prev: prevNode,
    edges: getEdges,
    values: getValues
};

});
