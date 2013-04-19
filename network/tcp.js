/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-16
 * Time: 下午3:28
 * To change this template use File | Settings | File Templates.
 */


var net = require('net');
var ExBuffer = require('ExBuffer');
var ByteBuffer = require('ByteBuffer');

function CreateServer(nPort, funInit, funReceive, funClose, funConnect, funError) {
    var server = net.createServer(function(hSocket) {
        // 粘包
        var exBuffer = new ExBuffer();

        // 收包处理
        exBuffer.on('data', function(hBuffer){
            var bytebuf = new ByteBuffer(hBuffer);
            var resArr = bytebuf.string().unpack();
            funReceive(hSocket, resArr[0]);
        });

        // 监听收包
        hSocket.on('data', function(data) {
            exBuffer.put(data);
        });

        // 断开
        hSocket.on('close', function() {
            funClose(hSocket);
        });

        //数据错误事件
        hSocket.on('error', function(e){
            funError(hSocket, e);
        });

        // 服务器关闭
        hSocket.on('end', function() {
            //console.log('server end!');
        });
    });
    server.listen(nPort);

    // 注册监听成功后的回调事件
    server.on('listening', function() {
        funInit();
    });

    // 注册客户端连接成功后的回调事件
    server.on('connection', function(hSocket) {
        funConnect(hSocket);
    });

    return server;
}

function SendBuffer(hSocket, buffer) {
    var byBuffer = new ByteBuffer();
    var buf = byBuffer.string(buffer).pack(true);
    hSocket.write(buf);
}


function CreateClient(nPort, szHost, funInit, funReceive) {

    if (szHost = "") {
        szHost = "127.0.0.1";
    }

    var exBuffer = new ExBuffer();
    var hSocket = net.connect(nPort, szHost, function() {
        if (funInit != null)
            funInit();
    });

    hSocket.on('data', function(data) {
        exBuffer.put(data);
    });

    hSocket.on('error',function(error){
        //console.log('error:'+ error);
        //hSocket.destory();
    });

    hSocket.on('close',function(){
        //console.log('Connection closed');
    });

    //当客户端收到完整的数据包时
    exBuffer.on('data', function(buffer) {
        var bytebuff = new ByteBuffer(buffer);
        var resArr = bytebuff.string().unpack();
        if (funReceive != null)
            funReceive(resArr[0]);
    });

    return hSocket;
}

function Close(server) {
    server.close();
}


module.exports = {
    CreateServer: CreateServer,
    CreateClient: CreateClient,
    SendBuffer: SendBuffer,
    Close: Close
};