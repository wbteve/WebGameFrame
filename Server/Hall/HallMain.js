/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-17
 * Time: 下午3:48
 * To change this template use File | Settings | File Templates.
 */
// 游戏大厅服务器，全局唯一

var cfg = require("../Config/Config");
var tcp = require("../../network/tcp");
var msg = require("../../network/msg");

var g_hGatewaySocket = null;
var g_nServerDUID = 0;

////////////////////////////////////////////////////////////////
// 连接网关
g_hGatewaySocket = tcp.CreateClient(
    cfg.GatewayServerPortLAN,
    cfg.GatewayServerIP,

    // 连接成功回调
    function(){
        // 发送登陆请求到网关
        var vPacket = msg.STServerLoginRequest();
        tcp.SendBuffer(g_hGatewaySocket, JSON.stringify(vPacket));
    },

    // 消息处理
    function(szBuffer){
        var vPacket = JSON.parse(szBuffer);
        switch (vPacket.nMsgCode) {
            case msg.MAKE_MSG_CODE(msg.MsgObj.Gateway, msg.MsgObj.Server, msg.MsgType.SS_ServerLogin) :
                g_nServerDUID = vPacket.nDstDUID;
                console.log("Login gateway success, duid=%s", g_nServerDUID);
                break;
        }
    }
);

////////////////////////////////////////////////////////////////