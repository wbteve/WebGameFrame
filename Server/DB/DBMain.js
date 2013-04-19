/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-18
 * Time: 下午6:23
 * To change this template use File | Settings | File Templates.
 */
// DB操作
var cfg = require("../Config/Config");
var errcode = require("../../network/errcode");
var mysql = require("mysql");
var strext = require("../../network/strext");

var conn = null;

////////////////////////////////////////////////////////////////
// 初始化
function InitDataBase() {
    conn = mysql.createConnection({
        host     : cfg.DataBaseIP,
        user     : cfg.DataBaseUser,
        password : cfg.DataBasePwd
    });

    // 开始连接
    conn.connect();
}

function UnInitDataBase() {
    conn.end();
}

// 登陆验证
function UserCheck(hSocket, szName, szPassword, onCallBack) {
    var sql = strext.format("select * from mytank.actor where name = '%s';", szName);
    conn.query(sql, function(err, rows){
        if (rows == undefined || rows.length == 0){
            onCallBack(hSocket, errcode.ERR_DB_NO_USER);
            return;
        }
        if (rows[0].password != szPassword){
            onCallBack(hSocket, errcode.ERR_DB_PWD_WRONG);
            return;
        }
        onCallBack(hSocket, errcode.ERR_DB_OK, rows[0].uuid);
    });
}

// 登陆流程
function UserLogin(hSocket, szName, szPassword, onCallBack) {
    UserCheck(hSocket, szName, szPassword,
        function(hSocket, nErrCode, nUUID){
            if (nErrCode == errcode.ERR_DB_OK) {
                // 如果验证通过，就查询玩家数据
                var sql = strext.format("select level, exp from mytank.level where uuid=%s", nUUID);
                conn.query(sql, function(err, rows){
                    var vUserBase = {nUUID : nUUID, nLevel:rows[0].level, nExp:rows[0].exp};
                    onCallBack(hSocket, errcode.ERR_DB_OK, vUserBase);
                    return;
                });
            } else {
                onCallBack(hSocket, nErrCode);
            }
        });
}

// 注册新用户
function UserRegister(hSocket, nUUID, szName, szPassword, onCallBack) {
    var sql = strext.format(
        "insert into mytank.actor values(%s,'%s','%s'); insert into mytank.level values(%s,0,0);",
        nUUID, szName, szPassword, nUUID
    );
    conn.query(sql, function(err, result){
        if (err != null){
            // 出错了，一般就是用户名重复了
            onCallBack(hSocket, errcode.ERR_DB_USERNAME_EXISTED, szName);
            return;
        }
        onCallBack(hSocket, errcode.ERR_DB_OK, szName);
    });
}

////////////////////////////////////////////////////////////////
module.exports = {
    InitDB : InitDataBase,
    UnInitDB : UnInitDataBase,
    UserCheck : UserCheck,
    UserLogin : UserLogin,
    UserRegister : UserRegister,

    end : null
};




