/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-18
 * Time: 下午5:05
 * To change this template use File | Settings | File Templates.
 */
// 测试用

var tcp = require("../network/tcp");
var msg = require("../network/msg");

// 1、连接网关
var g_hSocket = tcp.CreateClient(
    9000, "127.0.0.1",

    // 连接成功回调
    function() {
        // 请求登陆
        onLogin("name1", "password1");
        //onRegister("name1", "password1");
    },

    // 消息处理
    function(szBuffer) {
        var vPacket = JSON.parse(szBuffer);
        switch (vPacket.nMsgCode) {
            case msg.MAKE_MSG_CODE(msg.MsgObj.Server,msg.MsgObj.Client,msg.MsgType.CSC_ClientLogin) :
                console.log("收到 登陆 反馈！RetCode=%d, DUID=%d, UUID=%d, Level=%d, Exp=%d",
                    vPacket.nRetCode, vPacket.nDUID, vPacket.vBaseData.nUUID, vPacket.vBaseData.nLevel, vPacket.vBaseData.nExp);
                break;
            case msg.MAKE_MSG_CODE(msg.MsgObj.Server,msg.MsgObj.Client,msg.MsgType.CSC_ClientRegister) :
                console.log("收到 注册 反馈！RetCode=%d", vPacket.nRetCode);
                break;
        }
    }
);

// 2、注册账号
function onRegister(szName, szPassword) {
    var vPacket = msg.STClientRegisterRequest(szName, szPassword);
    tcp.SendBuffer(g_hSocket, JSON.stringify(vPacket));
    console.log("(%s:%s) 发出 注册 请求！", szName, szPassword);
};

// 3、登陆账号
function onLogin(szName, szPassword) {
    var vPacket = msg.STClientLoginRequest(szName, szPassword);
    tcp.SendBuffer(g_hSocket, JSON.stringify(vPacket));
    console.log("(%s:%s) 发出 登陆 请求！", szName, szPassword);
};

// 4、获取数据

