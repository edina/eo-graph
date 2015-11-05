var EOGraph = require('../src/eo-graph.js');
var assert = require('assert');
var fs = require('fs');

describe('EO-Graph', function() {
    var eoObj;
    var eo = new EOGraph();

    eoObj = {
      __version__: 2,
      __root__: {
        name: 'color',
        label: 'Select one color:',
        edges: [
          {
            label: 'Blue',
            value: '#0000ff',
            next: 'Id-00001'
          },
          {
            label: 'Green',
            value: '#00ff00',
            next: 'Id-00002'
          }
        ]
      },
      'Id-00001': {
        name: 'material',
        label: 'Choose a material:',
        edges: [
          {
            label: 'Leather',
            value: 'leather',
            next: '__end__'
          },
          {
            label: 'Fabric',
            value: 'fabric',
            next: '__end__'
          },
          {
            label: 'Material #',
            match: {
              type: 'number'
            },
            next: '__end__'
          }
        ]
      },
      __end__: {
        name: 'End'
      }
    };

    describe('init', function() {
        it('with a valid object and initial node', function() {
            assert.equal(true, eo.init(eoObj, '__root__'));
        });
    });

    describe('info', function() {
        it('with a valid object and initial node', function() {
            assert.deepEqual({ nodes: 1, edges: 3, version: 2 }, eo.getInfo());
        });
    });

    describe('next', function() {
        it('with a simple value', function() {
            var node = eo.next('#0000ff');

            assert.deepEqual(eoObj['Id-00001'], node);
        });

        it('with a typed value', function() {
            var node = eo.next(55);

            assert.deepEqual(eoObj.__end__, node);
        });
    });

    describe('edges', function() {
        it('get', function() {
            var edges = eo.edges();
            var expected = [
                {
                    edgeId: 'Id-00001',
                    value: '#0000ff',
                    label: 'Blue',
                    nodeName: 'Select one color:',
                    nodeId: '__root__'
                },
                {
                    edgeId: '__end__',
                    value: 55,
                    label: 'Material #',
                    nodeName: 'Choose a material:',
                    nodeId: 'Id-00001'
                }
            ];
            assert.deepEqual(edges, expected);
        });
    });

    describe('values', function() {
        it('get', function() {
            var values = eo.values();
            var expected = ['#0000ff', 55];

            assert.deepEqual(values, expected);
        });
    });

    describe('previous', function() {
        it('with a simple value', function() {
            var node = eo.previous();

            assert.deepEqual(eoObj['Id-00001'], node);
        });
    });

});
