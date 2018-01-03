'use strict';

var serialport = require('serialport');

serialport.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(' - pnpId: ' + port.pnpId);
    console.log(' - manufacturer: ' + port.manufacturer);
    console.log(' - serialNumber: ' + port.serialNumber);
    console.log(' - vendorId: ' + port.vendorId);
    console.log(' - productId: ' + port.productId);
  });
});