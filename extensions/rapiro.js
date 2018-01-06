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
        _toRapiro_wifi(cmd);
        window.setTimeout(function() {callback();}, 200);
    }

    ext.str2Rapiro_wifi = function(cmd,callback) {
        _toRapiro_wifi(cmd);
        window.setTimeout(function() {callback();}, 200);
    }

    ext.setIP = function(_ip) {
        ip=_ip;
    }

    function _toRapiro_wifi (msg) {
        var server = 'http://'+ip;
        var cmd = '/serial/write?text='+encodeURIComponent(msg);
        var uri = server+cmd;
        //alert(uri);
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
        //alert(uri);
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
 
    ext.connectRapiro_serial = function(callback) {
        _serialBridge("/rapiro/connect");
        window.setTimeout(function() {callback();}, 2000);
    }

    ext.disconnectRapiro_serial = function(callback) {
        _serialBridge("/rapiro/disconnect");
        window.setTimeout(function() {callback();}, 200);
    }

    ext.sendRapiro_serial = function(msg,callback) {
        _serialBridge("/rapiro/send/"+encodeURIComponent(msg));
        window.setTimeout(function() {callback();}, 200);
    }

    ext.str2Rapiro_serial = function(msg,callback) {
        _serialBridge("/rapiro/send/"+encodeURIComponent(msg));
        window.setTimeout(function() {callback();}, 200);
    }

    function paddy(n, p, c) {
        var pad_char = typeof c !== 'undefined' ? c : '0';
        var pad = new Array(1 + p).join(pad_char);
        return (pad + n).slice(-pad.length);
    };

    ext.cmdPS_wifi = function(s,a,t) {
        var cmd="#P"+s;
        cmd+="A"+paddy(a,3);
        cmd+="T"+paddy(t,3);
        _serialBridge("/rapiro/send/"+encodeURIComponent(cmd));
        window.setTimeout(function() {callback();}, 200);
    }

    // Block and block menu descriptions
    var descriptor = { 
        blocks: [
            ['w', 'Hi! Rapiro', 'connectRapiro_serial'],
            ['w', 'Bye~ Rapiro', 'disconnectRapiro_serial'],
            ['w', 'Serial %m.rapiroCMD to Rapiro', 'sendRapiro_serial', '#M0'],  
            ['w', 'Serial %s to Rapiro', 'str2Rapiro_serial', '#PS00A000T010'],  
            [' ', 'Rapiro IP %s', 'setIP', '192.168.4.1'],  
            ['w', 'Wifi %m.rapiroCMD to Raipro', 'sendRapiro_wifi', '#M0'],
            ['w', 'Wifi %s to Raipro', 'str2Rapiro_wifi', '#PS00A000T010'],
            ['w', '#PS%m.rapiroServo A%3n T%3n', 'cmdPS_wifi', 0,0,0],
        ],
        menus: {
            'restType': ['GET', 'POST'],
            'rapiroCMD': ['#M0','#M1','#M2','#M3','#M4','#M5','#M6','#M7','#M8','#M9'],
            'rapiroServo': ['S00','S01','S02','S03','S04','S05','S06','S07','S08','S09','S10','S11'],
        },
        url: 'http://jy3736.github.io/ScratchX/extensions/'
    };

    // Register the extension
    ScratchExtensions.register('Rapiro', descriptor, ext);
})({});
