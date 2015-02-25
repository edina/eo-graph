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


##### Utilities

###### Create the graph from a csv

A csv can be used for creating the csv.

The first column contains the type of the row:


**type**

It is ignored but is visually useful for creating the file

**answer or edge**
It is an answer to a question

 type  | label | value | from  | to
-------|-------|-------|-------|----


**question or node**


 type  | label | id
-------|-------|----


**root**
The entry point to the tree

 type  |  id
-------|-----


This command will generate the json with the graph, any error will be printed to stderr

```
npm run parse:csv -- ListOfAnswersAndQuestions.csv > graph.json
```

A common workflow would be start with the list of answers, if unique identifiers are used for the them those could be used as node identifiers, completing the **from** and **to** columns and executing the above command will generate a list of candidated questions/nodes that should be added to the input csv and creating the proper labels for the questions.
