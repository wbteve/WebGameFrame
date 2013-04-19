/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-19
 * Time: 上午8:56
 * To change this template use File | Settings | File Templates.
 */
// 字符串扩展

// 格式化
function format(str){
    var args = Array.prototype.slice.call(arguments, 1);
    var idx = 0;
    return str.replace(
        /\%s/g,
        function(m, i) {
            return args[idx++];
        });
}

module.exports = {
    format : format,

    end : null
};