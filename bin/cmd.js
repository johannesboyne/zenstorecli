#!/usr/bin/env node
var argv = require('yargs').argv,
http = require('http'),
net = require('net'),
colors = require('colors'),
url = require('url');

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
  console.log('store to %s on %s for %s', parsedStorage.hostname, parsedStorage.port);
  var req = http.request({
    hostname: parsedStorage.hostname,
    port: parsedStorage.port || 80,
    path: parsedStorage.path,
    method: 'PUT'
  }, function(res) {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', function (chunk) {
      body += chunk.toString();
    });
    res.on('end', function () {
      if (body.replace(/\s/g, '') === argv.store.replace(/\s/g, ''))
        console.info('√'.bold.green + ' stored'.green);
      else
        console.log('x storing error');
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.setHeader('Content-Type', 'application/json');

  // write data to request body
  req.write(argv.store);
  req.end();
} else if (argv.follow && argv.at) {
  var parsedStorage = url.parse(argv.at);
  console.log('connect to %s on %s', parsedStorage.hostname, parsedStorage.port);
  var client = net.connect({port: 8124, host: parsedStorage.hostname},
                           function() { //'connect' listener
                             client.write(JSON.stringify({zen: { update: true, name: argv.follow }}));
                             client.write('\n');
                           });
                           client.on('data', function(data) {
                             console.log('->'.bold.blue + ' received data:'.blue, data.toString().grey);
                           });
} else if (argv.pipe && argv.at) {
  var parsedStorage = url.parse(argv.at);
  console.log('connect to %s on %s', parsedStorage.hostname, parsedStorage.port);
  var client = net.connect({port: 8124, host: parsedStorage.hostname},
                           function() { //'connect' listener
                             client.write(JSON.stringify({zen: { pipeData: true, id: parsedStorage.path.replace(/\//, '') }}));
                             process.stdin.pipe(client);
                           });
} else {
  var fs = require('fs');
  fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}
