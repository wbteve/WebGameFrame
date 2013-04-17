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

var array = [];
array.push(1);
array.push(2);
array.push(3);
console.log("" + array);

array.splice(0, 1);
console.log("" + array);