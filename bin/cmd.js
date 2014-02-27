#!/usr/bin/env node
var argv = require('yargs').argv,
http = require('http'),
net = require('net'),
colors = require('colors'),
url = require('url'),
zenstorejs = require('zenstorejs');

function error (type) {
  switch (type) {
    case 1:
      console.error("Wrong Type of Arguments!");
    break;
    default:
      console.error("Error");
    break;
  }
}

if (argv.store && argv.at) {
  var parsedStorage = url.parse(argv.at);
  console.log('store to %s on %s for %s', parsedStorage.hostname, parsedStorage.port, argv.store);
  zenstorejs.store(argv.at, argv.store, function (err, ret) {
    if (!err)
      console.info('√'.bold.green + ' stored'.green);
    else
      console.log('x storing error');
  }); 
} else if (argv.follow && argv.at) {
  var parsedStorage = url.parse(argv.at);
  console.log('follow @ %s on %s', parsedStorage.hostname, argv.port || 8124);
  zenstorejs.follow(argv.follow, argv.at, function (stream) {
    stream.on('data', function (data) {
      console.log('->'.bold.blue + ' received data:'.blue, data.toString().grey);
    });
  });

} else if (argv.pipe && argv.at) {
  var parsedStorage = url.parse(argv.at);
  console.log('pipe to %s', parsedStorage.hostname);
  zenstorejs.createWritePipe(argv.at, function (zenPipe) {
    process.stdin.pipe(zenPipe);
  });
} else {
  var fs = require('fs');
  fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}
