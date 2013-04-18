/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-18
 * Time: 上午10:22
 * To change this template use File | Settings | File Templates.
 */
// DUID : 唯一标示，用于标示玩家和服务器等，DUID仅在运行期间有效，不会存入数据库
// UUID : 唯一标示，和DUID的区别是UUID将存入数据库，只能标示玩家

////////////////////////////////////////////////////////////////
// 玩家UUID
var vClientUUID = 1000;
function GetClientUUID(){
    return vClientUUID++;
}

////////////////////////////////////////////////////////////////
// 玩家DUID
var vClientDUID = 1001;   // 客户端DUID从1001开始
function GetClientDUID(){
    return vClientDUID++;
}

////////////////////////////////////////////////////////////////
// 网关DUID，固定的哦
var vGatewayDUID = 0;

////////////////////////////////////////////////////////////////
// 服务器DUID
var vServerDUID = 1;      // 服务器DUID从1开始
function GetServerDUID(){
    return vServerDUID++;
}

module.exports = {
    GetClientUUID : GetClientUUID,
    GetClientDUID : GetClientDUID,
    GetServerDUID : GetServerDUID,
    GatewayDUID : vGatewayDUID,

    end : null
};



