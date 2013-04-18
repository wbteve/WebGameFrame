/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-16
 * Time: 下午9:22
 * To change this template use File | Settings | File Templates.
 */
// 服务器配置参数

module.exports = {

    // 网关服务器参数
    GatewayServerIP : "127.0.0.1",
    GatewayServerPortWAN : 9000,        // 广域网监听端口，监听来自客户端的请求
    GatewayServerPortLAN : 9001,        // 局域网监听端口，监听来自大厅的请求

    // 大厅服务器参数
    HallServerIP : "127.0.0.1",
    HallServerPort : 9100,

    // 场景服务器参数
    SceneServerPortMin : 9200,
    SceneServerPortMax : 9300,

    // DB
    DataBaseIP : "127.0.0.1",
    DataBaseUser : "root",
    DataBasePwd : "123456",


    end : null
};