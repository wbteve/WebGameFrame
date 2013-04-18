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
var vMsgObj = {
    Client : 1,
    Gateway : 2,
    Server : 3
};

// 消息类型(1-1000)
var vMsgType = {

    // 客户端 <-> 服务器
    CSC_ClientLogin : 1,
    CSC_ClientLogout : 2,

    // 服务器
    SS_ServerLogin : 10,
    SS_ServerLogout : 11,

    end : null
};

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

module.exports = {
    MAKE_MSG_CODE : MAKE_MSG_CODE,
    GET_MSG_SRC : GET_MSG_SRC,
    GET_MSG_DST : GET_MSG_DST,
    GET_MSG_TYPE : GET_MSG_TYPE,
    GET_MSG_INFO : GET_MSG_INFO,

    MsgObj : vMsgObj,
    MsgType : vMsgType,

    end : null
};