/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-17
 * Time: 上午10:37
 * To change this template use File | Settings | File Templates.
 */

// 网络消息定义
// 消息码包含内容：消息源，消息目标，消息类型

// 消息对象
var MsgObj = {
    Client : 1,
    Gateway : 2,
    Server : 3
};

// 消息类型(1-1000)
// 请在此处新增消息类型
var MsgType = {

    // 客户端 <-> 服务器
    CSC_ClientRegister : 1,           // 注册新账号
    CSC_ClientLogin : 2,              // 登陆
    CSC_ClientLogout : 3,             // 登出

    // 服务器
    SS_ServerLogin : 10,
    SS_ServerLogout : 11,

    end : null
};

// 消息头，定义具体消息包时，请务必包含这几项
function STMsgHeader(nMsgCode, nSrcDUID, nDstDUID){
    var v = new Object();
    v.nMsgCode = nMsgCode;
    v.nSrcDUID = nSrcDUID;
    v.nDstDUID = nDstDUID;
    return v;
};

////////////////////////////////////////////////////////////////
function STUserBase(uuid, level, exp){
    var v = new Object();
    v.nUUID = uuid;
    v.nLevel = level;
    v.nExp = exp;
    return v;
}

////////////////////////////////////////////////////////////////
// 客户端请求
// 注册新用户
function STClientRegisterRequest(szName, szPassword){
    var v = new Object();
    v.nMsgCode = MAKE_MSG_CODE(
        MsgObj.Client,
        MsgObj.Server,
        MsgType.CSC_ClientRegister);
    v.szName = szName;
    v.szPassword = szPassword;
    return v;
};
function STClientRegisterResponse(nRetCode){
    var v = new Object();
    v.nMsgCode = MAKE_MSG_CODE(
        MsgObj.Server,
        MsgObj.Client,
        MsgType.CSC_ClientRegister);
    v.nRetCode = nRetCode;
    return v;
};

// 登陆
function STClientLoginRequest(szName, szPassword) {
    var v = new Object();
    v.nMsgCode = MAKE_MSG_CODE(
        MsgObj.Client,
        MsgObj.Server,
        MsgType.CSC_ClientLogin);
    v.szName = szName;
    v.szPassword = szPassword;
    return v;
};
function STClientLoginResponse(nRetCode, nDUID, vBaseData){
    var v = new Object();
    v.nMsgCode = MAKE_MSG_CODE(
        MsgObj.Server,
        MsgObj.Client,
        MsgType.CSC_ClientLogin);
    v.nRetCode = nRetCode;
    v.nDUID = nDUID;
    v.vBaseData = vBaseData;
    return v;
};

// 登出
function STClientLogoutRequest(nDUID) {
    var v = new Object();
    v.nMsgCode = MAKE_MSG_CODE(
        MsgObj.Client,
        MsgObj.Server,
        MsgType.CSC_ClientLogout);
    v.nDUID = nDUID;
    return v;
};


////////////////////////////////////////////////////////////////
// 服务器请求
function STServerLoginRequest() {
    var v = new Object();
    v.nMsgCode = MAKE_MSG_CODE(
        MsgObj.Server,
        MsgObj.Gateway,
        MsgType.SS_ServerLogin
    );
    return v;
};

function STServerLoginResponse(nSrcDUID, nDstDUID) {
    var v = new Object();
    v.nMsgCode = MAKE_MSG_CODE(
        MsgObj.Gateway,
        MsgObj.Server,
        MsgType.SS_ServerLogin
    );
    v.nSrcDUID = nSrcDUID;
    v.nDstDUID = nDstDUID;
    return v;
};


////////////////////////////////////////////////////////////////
// 组合消息码
function MAKE_MSG_CODE(nMsgFrom, nMsgTo, nMsgType){
    return nMsgFrom * 10000 + nMsgTo * 1000 + nMsgType;
}
// 根据消息码获取消息源
function GET_MSG_SRC(nMsgCode){
    return Math.floor(nMsgCode / 10000);
}
// 根据消息码获取消息目标
function GET_MSG_DST(nMsgCode){
    return Math.floor(nMsgCode / 1000 % 10);
}
// 根据消息码获取消息类型
function GET_MSG_TYPE(nMsgCode){
    return Math.floor(nMsgCode % 1000);
}
function GET_MSG_INFO(nMsgCode){
    return [GET_MSG_SRC(nMsgCode), GET_MSG_DST(nMsgCode), GET_MSG_TYPE(nMsgCode)];
}


////////////////////////////////////////////////////////////////
module.exports = {
    MAKE_MSG_CODE : MAKE_MSG_CODE,
    GET_MSG_SRC : GET_MSG_SRC,
    GET_MSG_DST : GET_MSG_DST,
    GET_MSG_TYPE : GET_MSG_TYPE,
    GET_MSG_INFO : GET_MSG_INFO,

    MsgObj : MsgObj,
    MsgType : MsgType,


    STUserBase : STUserBase,

    STClientRegisterRequest     : STClientRegisterRequest,
    STClientRegisterResponse    : STClientRegisterResponse,
    STClientLoginRequest        : STClientLoginRequest,
    STClientLoginResponse       : STClientLoginResponse,
    STClientLogoutRequest       : STClientLogoutRequest,

    STServerLoginRequest        : STServerLoginRequest,
    STServerLoginResponse       : STServerLoginResponse,

    end : null
};