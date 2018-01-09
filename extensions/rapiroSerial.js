/*
Send Raipro Commands via wf8266r
*/

(function (ext) {

    var restRet = "";
    var ip="";
    var port="";

    var cmdM = {
        "歸位":"#M0",
        "前進":"#M1",
        "後退":"#M2",
        "轉右":"#M3",
        "轉左":"#M4",
        "揮雙手閃綠眼":"#M5",
        "揮右手變黃眼":"#M6",
        "晃動雙臂變藍眼":"#M7",
        "揮左手變紅眼":"#M8",
        "舉右手轉身變藍眼":"#M9"
    }
    
    var cmdP = {
        "頭":"S00",
        "腰":"S01",
        "右肩":"S02",
        "右臂":"S03",
        "右手掌":"S04",
        "左肩":"S05",
        "左臂":"S06",
        "左手掌":"S07",
        "右腳踝":"S08",
        "右腳掌":"S09",
        "左腳踝":"S10",
        "左腳掌":"S11"
    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {}

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
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
        _serialBridge("/rapiro/send/"+encodeURIComponent(cmdM[msg]));
        window.setTimeout(function() {callback();}, 200);
    }

    function paddy(n, p, c) {
        var pad_char = typeof c !== 'undefined' ? c : '0';
        var pad = new Array(1 + p).join(pad_char);
        return (pad + n).slice(-pad.length);
    };

    ext.cmdPS_serial = function(s,a,t,callback) {
        s=cmdP[s];
        var cmd="#P"+s;
        switch(s) {
            case "S03": a=(a>130)?130:(a<40)?40:a; break;
            case "S04": a=(a>110)?110:(a<50)?40:a; break;
            case "S06": a=(a>90)?90:(a<0)?0:a; break;
            case "S07": a=(a>130)?130:(a<70)?70:a; break;
            default   : a=(a>180)?180:(a<0)?0:a; 
        }
        t=(t>255)?255:(t<0)?0:t;
        cmd+="A"+paddy(a,3);
        cmd+="T"+paddy(t,3);
        _serialBridge("/rapiro/send/"+encodeURIComponent(cmd));
        window.setTimeout(function() {callback();}, 100);
    }

    ext.cmdEyes_serial = function(r,g,b,t,callback) {
        var cmd="#P";
        r=(r>255)?255:(r<0)?0:r;
        g=(g>255)?255:(g<0)?0:g;
        b=(b>255)?255:(b<0)?0:b;
        t=(t>255)?255:(t<0)?0:t;
        cmd+="R"+paddy(r,3);
        cmd+="G"+paddy(g,3);
        cmd+="B"+paddy(b,3);
        cmd+="T"+paddy(t,3);
        _serialBridge("/rapiro/send/"+encodeURIComponent(cmd));
        window.setTimeout(function() {callback();}, 100);
    }

    // Block and block menu descriptions
    var descriptor = { 
        blocks: [
            ['w', '哈囉! Rapiro', 'connectRapiro_serial'],
            ['w', '拜~ Rapiro', 'disconnectRapiro_serial'],
            ['w', '動作 %m.rapiroCMDx', 'sendRapiro_serial', '歸位'],
            ['w', '姿勢 %m.rapiroServox 角度 %n 歷時 %n', 'cmdPS_serial', '頭', 90,10],
            ['w', '眼睛 紅 %n 綠 %n 藍 %n 歷時 %n', 'cmdEyes_serial', 0,255,0,10],
            ['w', '傳送 %s 到 Raipro', 'str2Rapiro_serial', '#PS00A090T010'],
        ],
        menus: {
            'restType': ['GET', 'POST'],
            'rapiroCMD': ['#M0','#M1','#M2','#M3','#M4','#M5','#M6','#M7','#M8','#M9'],
            'rapiroServo': ['S00','S01','S02','S03','S04','S05','S06','S07','S08','S09','S10','S11'],
            "rapiroCMDx": ["歸位","前進","後退","轉右","轉左","揮雙手閃綠眼","揮右手變黃眼",
                           "晃動雙臂變藍眼","揮左手變紅眼","舉右手轉身變藍眼"],
            "rapiroServox": ["頭","腰","右肩","右臂","右手掌","左肩","左臂","左手掌",
                             "右腳踝","右腳掌","左腳踝","左腳掌"],
        },
        url: 'http://jy3736.github.io/ScratchX/extensions/'
    };

    // Register the extension
    ScratchExtensions.register('Rapiro', descriptor, ext);
})({});
