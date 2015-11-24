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
var NODE = { label: 1, id: 2, type: 5, value: 6 };
var EDGE = { label: 1, value: 2, from: 3, to: 4, element: 5, elementOptions: 6};

var parser = parse({delimiter: ','});

parser
    .on('data', function(data) {
        var len;
        var rowType;
        var nodeId, nodeName, nodeLabel, nodeType, nodeTypeValue;
        var edge, fromNode, toNode, valueEdge, labelEdge, elementEdge, elementOptions, imgEdge;

        len = data.length;
        if (len > 0) {
            rowType = data[ROW.type];

            switch (rowType) {
                case 'question':
                case 'node':
                    if (len >= 4) {
                        nodeId = data[NODE.id];
                        nodeLabel = data[NODE.label];
                        if(data[NODE.value] !== ""){
                            nodeType = data[NODE.type];
                            nodeTypeValue = data[NODE.value];
                        }

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
                        if(nodeType !== undefined && nodeTypeValue !== undefined) {
                            graph[nodeId][nodeType] = nodeTypeValue;
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
                        if(data[EDGE.value].indexOf("[img:") > -1){
                            var rxText = /(.*)\[img:(.*)\]/;
                            var res = data[EDGE.value].match(rxText);
                            valueEdge = res[1];
                            imgEdge = res[2];
                        }
                        else{
                            valueEdge = data[EDGE.value];
                        }
                        labelEdge = data[EDGE.label];

                        if (len >= 6 && data[EDGE.element] !== '') {
                            elementEdge = data[EDGE.element];
                        }

                        if (len >= 7 && data[EDGE.elementOptions] !== '') {
                            elementOptions = data[EDGE.elementOptions].split(',');
                        }

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

                        edge = {
                            label: labelEdge,
                            next: toNode
                        };

                        switch (elementEdge){
                            case 'slider':
                                edge.element = {
                                    type: 'slider',
                                    options: {
                                        min: 0,
                                        max: 100,
                                        value: 50
                                    }
                                };

                                edge.match = {
                                    type: 'number'
                                };

                                if (elementOptions && elementOptions.length === 3) {
                                    edge.element.options.min = elementOptions[0];
                                    edge.element.options.max = elementOptions[1];
                                    edge.element.options.value = elementOptions[2];
                                }

                                break;
                            case 'textbox':
                                edge.element = {
                                    type: 'textbox'
                                };

                                edge.match = {
                                    type: 'nonempty'
                                };
                                break;
                            case 'checkbox':
                                edge.element = {
                                    type: 'checkbox',
                                    options: {
                                        value: valueEdge
                                    }
                                };

                                edge.match = {
                                    type: 'nonempty'
                                };
                                break;
                            default:
                                edge.value = valueEdge;
                                edge.image = imgEdge;
                        }

                        graph[fromNode].edges.push(edge);
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

        console.log(JSON.stringify(graph, null, '  '));
    })
    .on('error', function(error) {
        console.error(error);
    });

    return parser;
});
