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
function UserLoginCheck(szName, szPassword) {
    var sql = "select * from mytank.actor where name = '" + szName + "'";
    conn.query(sql, function(err, rows){
        if (rows == undefined || rows.length == 0){
            // 没有这个账号
            return errcode.ERR_DB_NO_USER;
        }
        if (rows[0].password != szPassword){
            return errcode.ERR_DB_PWD_WRONG;
        }
        return rows[0];
    });
}

////////////////////////////////////////////////////////////////
module.exports = {
    InitDB : InitDataBase,
    UnInitDB : UnInitDataBase,
    LoginCheck : UserLoginCheck,

    end : null
};




