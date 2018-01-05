/*
Send Raipro Commands via wf8266r
*/

(function (ext) {

    var restRet = "";
    var ip="";
    var port="";

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {

    }

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    }

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
    }

    ext.toRapiro = function(cmd,callback) {
        _toRapiro('%23'+cmd);
        window.setTimeout(function() {
            callback();
        }, 100);
    }

    ext.str2Rapiro = function(cmd,callback) {
        _toRapiro(cmd);
        window.setTimeout(function() {
            callback();
        }, 100);
    }

    ext.setIP = function(_ip) {
        ip=_ip;
    }

    function _toRapiro (cmd) {
        var uri = 'http://'+ip+'/serial/write?text='+cmd;
        $.ajax({
            url: uri,
            type: 'GET',
            success: function (data) {
                restRet = data;
            },
            error: function (e) {
                restRet = JSON.stringify(e);
            }
        });
    }
 
    function _toPyServer (cmd) {
        var uri = 'http://127.0.0.1:5000'+cmd;
        $.ajax({
            url: uri, 
            type: 'GET',
            success: function (data) {
                restRet = data;
            },
            error: function (e) {
                restRet = JSON.stringify(e);
            }
        });
    }
 
    ext.getArduino = function() {
        _toPyServer('/arduino')
        return restRet;
    }

    // Block and block menu descriptions
    var descriptor = { 
        blocks: [
            [' ', 'Arduino device', 'getArduino'],
            [' ', 'Rapiro IP %s', 'setIP', '192.168.4.1'],  
            ['w', '#%m.rapiroCMD to Raipro', 'toRapiro', 'M0'],
            ['w', 'Send %s to Raipro', 'str2Rapiro', 'M0'],
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
