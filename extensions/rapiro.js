/*

Orignal Sourc : http://unumobile.github.io/wf8266r.js-scratchx-extensions/arduino_extension.js

*/

(function (ext) {
    var ip = "";
    var isConnected = false;
    var connection;
    var gpio = { D0: 0, D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0, D7: 0, D8: 0, D9: 0, D10: 0, D11: 0, D12: 0, D13: 0, A0: 0, A1: 0, A2: 0, A3: 0, A4: 0, A5: 0 };
    var restfullGet = "";
    var lassData = { C: 0, H: 0, PM25: 0 };
    var voiceData = { Text: '' };
    var distance = 0;
    var rec = null;
    var isAutoOpen = false;
    //WF8266R
    var isConnectedWF8266R = false;
    var connectionWF8266R;
    var socketCounter = 0;
    var package = { send: 0, recv: 0, millis: 0 };
    var timeManager = { lastTime: 0, startTime: 0, millis: 0 };
    var socketBuffer="";

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {

    };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    ext.http = function (_type, uri, callback) {
        $.ajax({
            url: uri,
            type: _type,
            success: function (data) {
                callback(data);
                restfullGet = data;
            },
            error: function (e) {
                callback(e);
                restfullGet = JSON.stringify(e);
            }
        });
    };


    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'HTTP %m.restfulType 到 %s', 'http', 'POST', 'http://192.168.2.105/serial/write?text=%23M0'],
            ['w', 'HTTP %m.restfulType 從 %s', 'http', 'GET', 'http://192.168.2.105/serial/write?text=%23M0'],
        ],
        menus: {
            'restfulType': ['GET', 'POST'],
        },
        url: 'http://jy3736.github.io/ScratchX/extensions/'
    };

    // Register the extension
    ScratchExtensions.register('Rapiro', descriptor, ext);
})({});
