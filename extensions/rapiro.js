/*

Send Raipro Commands via wf8266r

*/

(function (ext) {

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

    ext.toRapiro = function(cmd) {
        _toRapiro(cmd);
    }

    ext.M1 = function () {
        _toRapiro('M1');
    };    
    
    ext.M2 = function () {
        _toRapiro('M2');
    };    
    
    function _toRapiro (cmd) {
        var uri = 'http://192.168.2.105/serial/write?text=%23'+cmd;
        $.ajax({
            url: uri,
            type: 'POST',
            success: function (data) {
                restGet = data;
            },
            error: function (e) {
                restGet = JSON.stringify(e);
            }
        });
    };
 
    // Block and block menu descriptions
    var descriptor = { 
        blocks: [  
            [' ', 'Send M1', 'M1'],
            [' ', 'Send M2', 'M2'],
            [' ', '#%.rapiroCMD to Raipro', 'toRapiro', 'M0'],
            ['w', 'HTTP %m.restType 到 %s', 'http', 'POST', 'http://192.168.2.105/serial/write?text=%23M0'],
            ['w', 'HTTP %m.restType 從 %s', 'http', 'GET', 'http://192.168.2.105/serial/write?text=%23M0'],
        ],
        menus: {
            'restType': ['GET', 'POST'],
            'rapiroCMD': ['M0','M1','M2','M3','M4','M5','M6','M7','M8','M9'],
        },
        url: 'http://jy3736.github.io/ScratchX/extensions/'
    };

    // Register the extension
    ScratchExtensions.register('Rapiro', descriptor, ext);
})({});
