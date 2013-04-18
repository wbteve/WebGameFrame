/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-18
 * Time: 下午12:48
 * To change this template use File | Settings | File Templates.
 */

function LOG(szFlag, szMsg){
    console.log("[%s] %s", szFlag, szMsg);
}

module.exports = {
    LOG : LOG,

    end : null
};
