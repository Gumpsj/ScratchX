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

    ext.sendRapiro_wifi = function(cmd,callback) {
        _toRapiro(cmd);
        window.setTimeout(function() {
            callback();
        }, 100);
    }

    ext.str2Rapiro_wifi = function(cmd,callback) {
        _toRapiro_wifi(cmd);
        window.setTimeout(function() {
            callback();
        }, 100);
    }

    ext.setIP = function(_ip) {
        ip=_ip;
    }

    function _toRapiro_wifi (msg) {
        var seriver = 'http://'+ip;
        var cmd = encodeURIComponent('/serial/write?text='+msg);
        var uri = server+cmd;
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
 
    function _serialBridge (msg) {
        var server = 'http://127.0.0.1';
        var uri = server+msg;
        $.ajax({
            url: uri, 
            type: 'GET',
            success: function (data) {
                restRet = data;
                //alert("Success : "+restRet);
            },
            error: function (e) {
                restRet = JSON.stringify(e);
                //alert("Error : "+restRet);
            }
        });
    }
 
    ext.connectRapiro_serial = function() {
        _serialBridge("/rapiro/connect");
        _delayMs(2500);
    }

    ext.disconnectRapiro_serial = function() {
        _serialBridge("/rapiro/disconnect");
        _delayMs(500);
    }

    ext.sendRapiro_serial = function(msg) {
        _serialBridge("/rapiro/send/"+encodeURIComponent(msg));
        _delayMs(500);
    }

    ext.str2Rapiro_serial = function(msg) {
        _serialBridge("/rapiro/send/"+encodeURIComponent(msg));
        _delayMs(500);
    }

    _delayMs = function(t) {
        window.setTimeout(function() {}, 100);        
    }

    // Block and block menu descriptions
    var descriptor = { 
        blocks: [
            [' ', 'Hi! Rapiro', 'connectRapiro_serial'],
            [' ', 'Bye~ Rapiro', 'disconnectRapiro_serial'],
            [' ', 'Serial %m.rapiroCMD to Rapiro', 'sendRapiro_serial', '#M0'],  
            [' ', 'Serial %s to Rapiro', 'str2Rapiro_serial', '#M0'],  
            [' ', 'Rapiro IP %s', 'setIP', '192.168.4.1'],  
            ['w', 'Wifi %m.rapiroCMD to Raipro', 'sendRapiro_wifi', '#M0'],
            ['w', 'Wifi %s to Raipro', 'str2Rapiro_wifi', 'M0'],
        ],
        menus: {
            'restType': ['GET', 'POST'],
            'rapiroCMD': ['#M0','#M1','#M2','#M3','#M4','#M5','#M6','#M7','#M8','#M9'],
        },
        url: 'http://jy3736.github.io/ScratchX/extensions/'
    };

    // Register the extension
    ScratchExtensions.register('Rapiro', descriptor, ext);
})({});
