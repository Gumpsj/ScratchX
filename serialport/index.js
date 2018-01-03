'use strict';

const serialport = require('serialport');
const readline = require('readline');
const sp_readline = serialport.parsers.Readline;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'select port> '
});

var idx = 0;
var ports = [];

console.log('COM port list:');
serialport.list(function (err, p) {
  p.forEach(function(p) {
    ports.push(p.comName);
    console.log(' [' + idx + '] ' + p.comName);
    idx++;
  });

  rl.prompt();
 
  rl.on('line', function(line) {
    //console.log(line);
    //console.log(ports);
    if(line<idx) {
      console.log('Opening ' + ports[Number(line)]);
     
      const port = new serialport(ports[Number(line)], {
        baudRate: 9600
        });
      const parser = new sp_readline();
      port.pipe(parser); 

      parser.on('data', function(data){
        console.log(data);
      });
       
      port.on('error', function(e) {
        console.error(e.message);
        process.exit(0);
      }); 
       
      port.on('open', function() {
        console.log('Serial Port Opened');
      });

      port.on('close', function(err) {
        console.log('Serial Port Closed: ' + err);
        process.exit(0);
      });
 
    } else {
      console.error('ERROR: Wrong port number');
      process.exit(0);
    }
  });
 
  rl.on('close', function() {
  console.log('Bye!');
  process.exit(0);
});
 
});