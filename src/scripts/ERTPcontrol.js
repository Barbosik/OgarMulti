// ==UserScript==
// @name         E, R, T, and P keys
// @version      1.0
// @description  Adds E, R, T, and P keys to the vanilla client
// @author       ZfsrGhS953
// @match        *.agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

/************************************************

Made by @ZfsrGhS953 on GitHub
Go check out his project! Its really nice :)
https://github.com/ZfsrGhS953/Petridish-Ogar

************************************************/


setTimeout(function() {
    window.__WebSocket = window.WebSocket;
    window.fakeWebSocket = function() {
        return {
            readyState: 0
        };
    };
    window._WebSocket = window.WebSocket = function(ip) {
        return new window.fakeWebSocket(ip);
    };
    window.key = {
        e: false,
        r: false,
        t: false,
        p: false
    };
    window.addEventListener("load", function() {
        // код инжектинга
        if (!window.OldSocket)
        OldSocket = window.__WebSocket;
        window._WebSocket = window.WebSocket = window.fakeWebSocket = function(ip) {
            var ws = new OldSocket(ip);
            ws.binaryType = "arraybuffer";
            var fakeWS = {};
            for (var i in ws) {
                fakeWS[i] = ws[i];
            }
            fakeWS.send = function() {
                if (arguments[0][0] == 16) {
                    if (window.key.e){
                        arguments[0] = new Int8Array(1);
                        arguments[0][0] = 22;
                    }
                    if (window.key.r){
                        arguments[0] = new Int8Array(1);
                        arguments[0][0] = 23;
                    }
                    if (window.key.t){
                        arguments[0] = new Int8Array(1);
                        arguments[0][0] = 24;
                    }
                    if (window.key.p) {
                        arguments[0] = new Int8Array(1);
                        arguments[0][0] = 25;
                    }
                window.key.e = window.key.r = window.key.t = window.key.p = false;
                }
            return ws.send.apply(ws, arguments);
            };
            ws.onmessage = function() {
                fakeWS.onmessage && fakeWS.onmessage.apply(ws, arguments);
            };
            ws.onopen = function() {
                fakeWS.readyState = 1;
                fakeWS.onopen.apply(ws, arguments);
            };
            ws.onclose = function(){
                fakeWS.onclose.apply(ws, arguments);
            };
        return fakeWS;
        };
    });
    document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 69:
                window.key.e = true;
                break;
            case 82:
                window.key.r = true;
                break;
            case 84:
                window.key.t = true;
                break;
            case 80:
                window.key.p = true;
                break;
        }
    });
}, 200);
