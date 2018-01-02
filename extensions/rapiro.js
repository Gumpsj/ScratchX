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

    ext.toRaipro = function (cmd) {
        url = 'http://192.168.2.105/serial/write?text='+cmd;
        $.http('POST',url);
    };


    // Block and block menu descriptions
    var descriptor = { 
        blocks: [
            [' ', 'To Raipro %s', 'toRaipro','%23M0'],
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
