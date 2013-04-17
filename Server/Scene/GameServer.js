/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-14
 * Time: 下午8:18
 * To change this template use File | Settings | File Templates.
 */

var http = require("http");
var url = require("url");

function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("收到请求，开始处理。。。" + pathname);
    response.writeHead(200, {"Content-Type" : "text/plain"});
    response.write("Hello World!");
    response.end();
    console.log("收到请求，处理结束");
}

http.createServer(onRequest).listen(8888);
console.log("服务器启动成功。。。");