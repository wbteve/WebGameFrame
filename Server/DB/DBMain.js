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
function UserLogin(hSocket, szName, szPassword, onCallBack) {
    var sql = "select * from mytank.actor where name = '" + szName + "'";
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

// 注册新用户
function UserRegister(hSocket, nUUID, szName, szPassword, onCallBack) {
    var sql = "insert into mytank.actor values(" + nUUID + ", '" + szName + "', '" + szPassword + "');";
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
    UserLogin : UserLogin,
    UserRegister : UserRegister,

    end : null
};




