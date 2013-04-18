/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-18
 * Time: 下午8:12
 * To change this template use File | Settings | File Templates.
 */
// 错误码定义
module.exports = {

    // 数据库操作
    ERR_DB_OK               : 1,    // 操作成功
    ERR_DB_NO_USER          : 1000, // 没有这个账号
    ERR_DB_PWD_WRONG        : 1001, // 密码错误
    ERR_DB_USERNAME_EXISTED : 1002, // 用户名已经存在

    end : null
};