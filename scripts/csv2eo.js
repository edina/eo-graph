var fs = require('fs');
var parser = require('../src/eo-graph-import.js');

var argv = process.argv;
var readStream;

if (argv.length === 3) {
    readStream = fs.createReadStream(argv[2]);
    readStream.on('open', function() {
        readStream.pipe(parser);
    });
}
else {
    console.error('Invalid number of arguments');
}
