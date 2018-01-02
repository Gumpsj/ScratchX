/*

Send Raipro Commands via wf8266r

*/

(function (ext) {
    var ip = "";
    var isConnected = false;
    var connection;
    var restGet = "";

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
                restGet = data;
            },
            error: function (e) {
                callback(e);
                restGet = JSON.stringify(e);
            }
        });
    };

    ext.toRapiro = function (cmd, callback) {
        var uri = 'http://192.168.2.105/serial/write?text='+cmd;
        $.ajax({
            url: uri,
            type: 'POST',
            success: function (data) {
                callback(data);
                restGet = data;
            },
            error: function (e) {
                callback(e);
                restGet = JSON.stringify(e);
            }
        });
    };


    ext.M1 = function (callback) {
        var uri = 'http://192.168.2.105/serial/write?text=%23M1';
        $.ajax({
            url: uri,
            type: 'POST',
            success: function (data) {
                callback(data);
                restGet = data;
            },
            error: function (e) {
                callback(e);
                restGet = JSON.stringify(e);
            }
        });
    };    
    
    ext.M2 = function (callback) {
        sendM2(callback);
    };    
    
    function sendM2 (callback) {
        var uri = 'http://192.168.2.105/serial/write?text=%23M2';
        $.ajax({
            url: uri,
            type: 'POST',
            success: function (data) {
                restGet = data;
            },
            error: function (e) {
                callback(e);
                restGet = JSON.stringify(e);
            }
        });
    };
 
    // Block and block menu descriptions
    var descriptor = { 
        blocks: [  
            ['w', 'To Raipro %s', 'toRapiro','%23M0'],
            ['w', 'Send M1', 'M1'],
            ['w', 'Send M2', 'M2'],
            ['w', 'HTTP %m.restType 到 %s', 'http', 'POST', 'http://192.168.2.105/serial/write?text=%23M0'],
            ['w', 'HTTP %m.restType 從 %s', 'http', 'GET', 'http://192.168.2.105/serial/write?text=%23M0'],
        ],
        menus: {
            'restType': ['GET', 'POST'],
        },
        url: 'http://jy3736.github.io/ScratchX/extensions/'
    };

    // Register the extension
    ScratchExtensions.register('Rapiro', descriptor, ext);
})({});
