(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(function(require) {
            var parse = require('csv-parse');

            return factory(parse, fs);
        });
    }else if (typeof module === 'object' && module.exports) {
        var parse = require('csv-parse');

        module.exports = factory(parse);
    }
})(this, function(parse) { // jscs:disable validateIndentation
'use strict';

var graph = {
    __version__: 2,
    __end__: {
        label: 'END'
    }
};

// Position of the data in the csv
var ROW = { type: 0 };
var ROOT = { id: 1 };
var NODE = { label: 1, id: 2 };
var EDGE = { label: 1, value: 2, from: 3, to: 4 };

var parser = parse({delimiter: ','});

parser
    .on('data', function(data) {
        var len;
        var rowType;
        var nodeId, nodeName, nodeLabel;
        var fromNode, toNode, valueEdge, labelEdge;

        len = data.length;
        if (len > 0) {
            rowType = data[ROW.type];

            switch (rowType) {
                case 'question':
                case 'node':
                    if (len >= 4) {
                        nodeId = data[NODE.id];
                        nodeLabel = data[NODE.label];

                        // Check id the node has been defined
                        if (!graph.hasOwnProperty(nodeId)) {
                            graph[nodeId] = {
                                name: nodeId,
                                label: nodeLabel
                            };
                        }
                        else {
                            graph[nodeId].name = nodeId;
                            graph[nodeId].label = nodeLabel;
                        }
                    }
                    else {
                        console.error('Invalid node row: ' + data);
                    }
                break;
                case 'answer':
                case 'edge':
                    if (len >= 5) {
                        fromNode = data[EDGE.from];
                        toNode = data[EDGE.to];
                        valueEdge = data[EDGE.value];
                        labelEdge = data[EDGE.label];

                        // If the edge not has a toNode assume that is the end
                        if (toNode === '') {
                            toNode = '__end__';
                        }

                        // If an edge refers the node create it
                        if (!graph.hasOwnProperty(fromNode)) {
                            graph[fromNode] = {
                                name: fromNode
                            };
                        }

                        if (!graph.hasOwnProperty(toNode)) {
                            graph[toNode] = {
                                name: toNode
                            };
                        }

                        if (!graph[fromNode].hasOwnProperty('edges')) {
                            graph[fromNode].edges = [];
                        }

                        graph[fromNode].edges.push({
                            label: labelEdge,
                            value: valueEdge,
                            next: toNode
                        });
                    }
                break;
                case 'root':
                    if (len >= 1) {
                        graph.__root__ = data[ROOT.id];
                    }
                break;
                default:
                    console.warn('Skip row: ' + data);
            }
        }
    })
    .on('finish', function() {
        var node;
        var noEdges = [];
        var noLabel = [];
         // Report nodes without label
        for (var key in graph) {
            if (graph.hasOwnProperty(key)) {
                node = graph[key];
                if (node.edges === undefined || node.edges.length === 0) {
                    noEdges.push(key);
                }
                if (node.label === undefined) {
                    noLabel.push(key);
                }
            }
        }
        console.warn('Nodes without label: ' + noLabel);
        console.warn('Nodes without edges: ' + noEdges);

        console.log(JSON.stringify(graph));
    })
    .on('error', function(error) {
        console.error(error);
    });

    return parser;
});
