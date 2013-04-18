/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-16
 * Time: 下午3:14
 * To change this template use File | Settings | File Templates.
 */
/*var net = require('net');
var server = net.createServer(function(c) {
    console.log('server connected');
    c.on('end',
        function() {
            console.log('server disconnected');
        }
    );
    c.write('hello\r\n');
    c.pipe(c);
});

server.listen(8124, function() {
    console.log('server bound');
});*/
/*function Func(n){
    console.log("参数类型：" + typeof(arguments));
    return [Math.floor(n/100), Math.floor(n/10%10), Math.floor(n%10)];
}

var a = Func(123);
console.log("a = " + a);*/
/*
// 定义结构体
function STUser(szName, szPassword){
    this.szName = szName;
    this.szPassword = szPassword;
}

var v = new STUser("name1", "pwd1");
console.log("name : %s, password : %s", v.szName, v.szPassword);
console.log("type : " + typeof(v));

function CreateUser(name, pwd){
    var v = new Object();
    v.szName = name;
    v.szPassword = pwd;
    return v;
}
var vv = CreateUser("name2", "pwd2");
console.log("name : %s, password : %s", vv.szName, vv.szPassword);
console.log("type : " + typeof(vv)); */

var db = require("../Server/DB/DBMain");
var errcode = require("../network/errcode");

db.InitDB();

function onCallBack(nRetCode, nUUID) {
    console.log("RetCode=%s, UUID=%s", nRetCode, nUUID);
}

//var ret = db.LoginCheck("name1", "password1", onCallBack);
//console.log("RetCode = " + ret);
db.UserRegister(null, 1236, "name5", "password1", onCallBack);

db.UnInitDB();