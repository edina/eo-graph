Earth Observation Graph
=======================

Library to transverse the Earth Observation Graph


## Install


``` npm install . ```


## Usage

#### Importing the module

```
// commonsjs
var eo = require('eo-graph');

// amd
require(['eo-graph'], function(eo)){
...
}

```
### The Graph

The graph is an object where the nodes represent the questions and the edges represent the possible answers.

```
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
        value: {
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
```



#### Functions

**Initialize the graph**: Pass a object containing the graph and a starting node

```
eo.init(eoObj, '__root__');
```

**Next node**: it receives a value that'll be compared with the values in the edges.

The value can be a simple match:

```
eo.next('#0000ff');
//   [ { label: 'Leather', value: 'leather', next: '__end__' },
//     { label: 'Fabric', value: 'fabric', next: '__end__' },
//     { label: 'Material #', value: [Object], next: '__end__' } ] }
```

Or a javascript type i.e. number, string.

```
eo.next(55);

```

**Get edges**: Return a list of edges visited

```
eo.edges()
// [ { edgeId: 'Id-00001', value: '#0000ff' },
//   { edgeId: '__end__', value: 55 } ]

```

**Get values**: Return a list with the values associated to the edges visited

```
eo.values()
// [ '#0000ff', 55 ]
```

**Previous node**: Go back to the previous node visited and drop the value of the edge.

```
eo.prev();
```


**Current node**: Returns the current node

```
eo.current();

```

