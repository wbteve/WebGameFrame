/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-16
 * Time: 下午9:15
 * To change this template use File | Settings | File Templates.
 */
// 适配服务器，有且仅有一个实例。用来接受客户端连接，并负载均衡到网关

var cfg = require("../Config/Config");
var tcp = require("../../network/tcp");
var msg = require("../../network/msg");

// 网关池
var g_GatewayPool = [];
function CGateway(szIP, nPort, hSocket) {
    this.szIP = szIP;                // 网关IP
    this.nPort = nPort;              // 端口号
    this.hSocket = hSocket;          // socket句柄
};
var g_PlayerCount = 0;
var g_CurGatewayPort = cfg.GatewayPortMin;

// 启动适配服务器
tcp.CreateServer(
    cfg.AdapterServerPort,

    // 初始化函数
    function() {
        console.log("[AdapterServer]...init success!");
    },

    // 收包函数
    function(hSocket, szBuffer) {
        var vPacket = JSON.parse(szBuffer);
        console.log("Recv : " + vPacket.msg);

        switch (vPacket.msg) {
            case msg.G2A_GetPort:
                // 网关启动时，请求端口号
                onGatewayGetPort(hSocket);
                break;
            case msg.G2A_Register:
                // 注册网关
                onGatewayRegister(hSocket, vPacket);
                break;
            case msg.C2A_GetGateway:
                // 客户端请求
                onClientGetGateway(hSocket);
                break;
        };
    },

    // 服务器关闭处理
    function(hSocket) {
        var nCount = g_GatewayPool.length;
        console.log("网关数量：" + nCount);
        for (var i = 0; i < nCount; i++) {
            var gate = g_GatewayPool[i];
            if (gate.hSocket == hSocket) {
                console.log("Gateway(%s:%d) down!", gate.szIP, gate.nPort);
                g_GatewayPool.splice(i, 1);
                break;
            }
        }
        console.log("网关数量：" + g_GatewayPool.length);
    },

    // 连接响应
    function(hSocket) {

    }
);

// 给新网关分配Port
function onGatewayGetPort(hSocket) {
    var vPacket = {};
    vPacket.msg = msg.A2G_GetPort;
    vPacket.err = -1;

    if (g_CurGatewayPort <= cfg.GatewayportMax) {
        vPacket.err = 1;
        vPacket.port = g_CurGatewayPort;
        g_CurGatewayPort++;
    }

    tcp.SendBuffer(hSocket, JSON.stringify(vPacket));
};

// 向适配器中注册网关
function onGatewayRegister(hSocket, vPacket) {
    var gate = new CGateway(vPacket.ip, vPacket.port, hSocket);
    g_GatewayPool.push(gate);

    console.log("Add gateway (%s:%d)", vPacket.ip, vPacket.port);
};

// 响应客户端连接请求
function onClientConn(hSocket) {
    var add = hSocket.address();
    console.log("新客户端：(family:%s, ip:%s, port:%d)", add.family, add.address, add.port);

    g_PlayerCount++;
    var vPacket = {};
    vPacket.msg = msg.A2C_GetGateway;
    vPacket.err = -1;

    // 分配客户端连接到网关
    if (g_GatewayPool.length > 0) {
        var idx = g_PlayerCount % g_GatewayPool.length;
        var gate = g_GatewayPool[idx];
        vPacket.err = 0;
        vPacket.ip = gate.szIP;
        vPacket.port = gate.nPort;
    };
    tcp.SendBuffer(hSocket, JSON.stringify(vPacket));
}