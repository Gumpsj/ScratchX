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

    ext.sendRapiro_wifi = function(cmd) {
        _toRapiro_wifi(cmd);
        _delayMs(100);
    }

    ext.str2Rapiro_wifi = function(cmd) {
        _toRapiro_wifi(cmd);
        _delayMs(100);
    }

    ext.setIP = function(_ip) {
        ip=_ip;
    }

    function _toRapiro_wifi (msg) {
        var seriver = 'http://'+ip;
        var cmd = '/serial/write?text='+msg;
        var uri = encodeURIComponent(server+cmd);
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
        var uri = encodeURIComponent(server+msg);
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
        _delayMs(2000);
    }

    ext.disconnectRapiro_serial = function() {
        _serialBridge("/rapiro/disconnect");
        _delayMs(100);
    }

    ext.sendRapiro_serial = function(msg) {
        _serialBridge("/rapiro/send/"+msg);
        _delayMs(100);
    }

    ext.str2Rapiro_serial = function(msg) {
        _serialBridge("/rapiro/send/"+msg);
        _delayMs(100);
    }

    _delayMs = function(t) {
        window.setTimeout(function() {}, t);        
    }

    // Block and block menu descriptions
    var descriptor = { 
        blocks: [
            [' ', 'Hi! Rapiro', 'connectRapiro_serial'],
            [' ', 'Bye~ Rapiro', 'disconnectRapiro_serial'],
            [' ', 'Serial %m.rapiroCMD to Rapiro', 'sendRapiro_serial', '#M0'],  
            [' ', 'Serial %s to Rapiro', 'str2Rapiro_serial', '#PS00A000T010'],  
            [' ', 'Rapiro IP %s', 'setIP', '192.168.4.1'],  
            [' ', 'Wifi %m.rapiroCMD to Raipro', 'sendRapiro_wifi', '#M0'],
            [' ', 'Wifi %s to Raipro', 'str2Rapiro_wifi', '#PS00A000T010'],
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
