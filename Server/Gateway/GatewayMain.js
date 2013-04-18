/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-17
 * Time: 上午9:49
 * To change this template use File | Settings | File Templates.
 */
// 网关服务器
// 1、监听广域网端口，接收客户端请求
// 2、监听局域网端口，接收内部服务器的消息转发
// 3、为服务器分配UUID

var cfg = require("../Config/Config");
var tcp = require("../../network/tcp");
var msg = require("../../network/msg");
var duid = require("../../network/duid");
var log = require("../../network/log");

var LOG_FLAG = "GatewayServer";

////////////////////////////////////////////////////////////////
// 连接管理
var g_hSocketWAN = null;        // 监听广域网端口，接收来自客户端的消息
var g_hSocketLAN = null;        // 监听局域网端口，接收来自服务器的消息
var g_ServerPool = [];          // 服务器的socket，用于向服务器发送消息
var g_ClientPool = [];          // 客户端的socket，用于向客户端发送消息

function STClient(hSocket, nUUID, nDUID){
    this.hSocket = hSocket;
    this.nUUID = nUUID;
    this.nDUID = nDUID;
};

function STServer(hSocket, nDUID){
    this.hSocket = hSocket;
    this.nDUID = nDUID;
    this.szIP = hSocket.address().address;
    this.nPort = hSocket.address().port;
};

////////////////////////////////////////////////////////////////
// 启动网关服务器，监听来自客户端的消息
g_hSocketWAN = tcp.CreateServer(
    cfg.GatewayServerPortWAN,

    // 初始化函数
    function() {
        log.LOG(LOG_FLAG, "init WAN success!");
    },

    // 消息处理函数
    function(hSocket, szBuffer) {
        var vPacket = JSON.parse(szBuffer);
        var vMsgType = msg.GET_MSG_TYPE(vPacket.nMsgCode);
        switch (vMsgType) {
            case msg.MsgType.CSC_ClientLogin:
                // 玩家登陆
                onClientLogin(hSocket, vPacket);
                break;
            case msg.MsgType.CSC_ClientLogout:
                // 玩家登出
                onClientLogout(hSocket, vPacket);
                break;
            default :
                // 将客户端的消息路由到内部服务器
                onClientMsgRoute(hSocket, vPacket);
                break;
        }
    },

    // 服务器关闭处理
    function(hSocket){

    },

    // 连接响应
    function(hSocket){
        // 有客户端连接上来了，
    }
);

// 客户端请求登陆
function onClientLogin(hSocket, vPacket){
    // 连接DB，进行登陆验证
    var nUUID = 0;

    // 验证通过，将玩家加入到玩家列表中
    var client = new STClient(hSocket, nUUID, duid.GetClientDUID());
    g_ClientPool.push(client);

    // 发送反馈消息到客户端
    var vPacket = null;

    log.LOG(LOG_FLAG,
        "ClientLogin:(ip:" + hSocket.address().address +
        " duid:" + client.nDUID +
        " uuid:" + client.nUUID +
        ")"
    );
};

// 客户端请求登出
function onClientLogout(hSocket, vPacket){
    // 发送消息到大厅
    //var vPacket = null;

    // 从网关中登出此玩家
    var nCount = g_ClientPool.length;
    var client = null;
    for (var i = 0; i < nCount; i++){
        client = g_ClientPool[i];
        if (client.hSocket == hScoket){
            log.LOG(LOG_FLAG,
                "ClientLogout:(ip:" + hSocket.address().address +
                " duid:" + client.nDUID +
                " uuid:" + client.nUUID +
                ")"
            );
            g_ClientPool.splice(i, 1); // 从i下标开始，删除一个元素
            break;
        }
    }
};

// 客户端消息路由
function onClientMsgRoute(hSocket, vPacket){

};

////////////////////////////////////////////////////////////////
// 监听来自服务器的消息
g_hSocketLAN = tcp.CreateServer(
    cfg.GatewayServerPortLAN,

    // 初始化函数
    function() {
        log.LOG(LOG_FLAG, "init LAN success!");
    },

    // 消息处理函数
    function(hSocket, szBuffer) {
        // 来自内部服务器的消息
        var vPacket = JSON.parse(szBuffer);
        var vMsgType = msg.GET_MSG_TYPE(vPacket.nMsgCode);
        switch (vMsgType){
            case msg.MsgType.SS_ServerLogin :
                // 有新服务器连接上来了
                onAddServer(hSocket);
                break;
            case msg.MsgType.SS_ServerLogout :
                // 有服务器要下线了
                onRemoveServer(hSocket);
                break;
            default:
                onServerMsgRoute(hSocket, vPacket);
                break;
        }
    },

    // 服务器关闭处理
    function(hSocket){
        onRemoveServer(hSocket);
    },

    // 连接响应
    function(hSocket){

    }
);

function onAddServer(hSocket){
    var srv = new STServer(hSocket, duid.GetServerDUID());
    g_ServerPool.push(srv);

    // 发送反馈消息
    var vPacket = {};
    vPacket.nMsgCode = msg.MAKE_MSG_CODE(
        msg.MsgObj.Gateway,
        msg.MsgObj.Server,
        msg.MsgType.SS_ServerLogin
    );
    vPacket.nSrcDUID = duid.GatewayDUID;
    vPacket.nDstDUID = srv.nDUID
    tcp.SendBuffer(hSocket, JSON.stringify(vPacket));
    log.LOG(LOG_FLAG,
        "AddServer(ip:" + hSocket.address().address +
        " duid:" + srv.nDUID +
        ")"
    );
}

function onRemoveServer(hSocket){
    var nCount = g_ServerPool.length;
    var srv = null;
    for (var i = 0; i < nCount; i++) {
        srv = g_ServerPool[i];
        if (srv.hSocket == hSocket) {
            log.LOG(LOG_FLAG,
                "RemoveServer(ip:" + srv.szIP +
                " port:" + srv.nPort +
                " duid:" +srv.nDUID +
                ")"
            );
            g_ServerPool.splice(1, i);
        }
    }
}

// 服务器消息路由
function onServerMsgRoute(hSocket, vPacket){
    var vMsgCode = msg.GET_MSG_INFO(vPacket.nMsgCode);

}