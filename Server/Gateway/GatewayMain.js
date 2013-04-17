/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-17
 * Time: 上午9:49
 * To change this template use File | Settings | File Templates.
 */
// 网关服务器

var cfg = require("../Config/Config");
var tcp = require("../../network/tcp");
var msg = require("../../network/msg");

////////////////////////////////////////////////////////////////
// 向适配服务器申请端口
var g_hAdapterSocket = null;

g_hAdapterSocket = tcp.CreateClient(
    cfg.AdapterServerPort,
    cfg.AdapterServerIP,

    function() {
        // 连接成功后，立即发送请求
        var vPacket = {};
        vPacket.msg = msg.G2A_GetPort;
        tcp.SendBuffer(g_hAdapterSocket, JSON.stringify(vPacket));
    },

    function(szBuffer) {
        // 收到消息
        var vPacket = JSON.parse(szBuffer);
        switch (vPacket.msg) {
            case msg.A2G_GetPort:
                RunGateway(parseInt(vPacket.port));
                break;
        }
    }
);


// 启动网关服务器
var g_hGatewaySocket = null;

function RunGateway(nPort) {
    g_hGatewaySocket = tcp.CreateServer(
        nPort,

        // 初始化函数
        function() {
            var add = g_hGatewaySocket.address();
            console.log("GatewayServer[%d]...init success!", add.port);

            // 向适配服务器注册
            var vPacket = {};
            vPacket.msg = msg.G2A_Register;
            vPacket.ip = add.address;
            vPacket.port = add.port;
            tcp.SendBuffer(g_hAdapterSocket, JSON.stringify(vPacket));
        },

        // 收包函数
        function(hSocket, szBuff) {
            var vPacket = JSON.parse(szBuff);
            console.log("Recv : " + vPacket);


        },

        // 服务器关闭处理
        function(hSocket) {
            console.log("socket close");
        },

        // 连接响应
        function(hSocket) {

        }
    );
};