var http =require('http')

http.createServer(function(request,response){
    response.writeHead(200,{'Content-Type':'text/plain'})
    response.write('Hello Nodejs')
    response.end()
}).listen(3000)

/*
    http 상태코드
    https://ooz.co.kr/260
*/