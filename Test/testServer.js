/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-16
 * Time: 下午3:14
 * To change this template use File | Settings | File Templates.
 */
/*var net = require('net');
var server = net.createServer(function(c) {
    console.log('server connected');
    c.on('end',
        function() {
            console.log('server disconnected');
        }
    );
    c.write('hello\r\n');
    c.pipe(c);
});

server.listen(8124, function() {
    console.log('server bound');
});*/
function Func(n){
    console.log("参数类型：" + typeof(arguments));
    return [Math.floor(n/100), Math.floor(n/10%10), Math.floor(n%10)];
}

var a = Func(123);
console.log("a = " + a);
