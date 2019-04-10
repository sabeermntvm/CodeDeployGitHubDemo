const http=require('http');
const server= http.createServer((req,res)=>
{
    if(req.url==='/')
    {
            res.write('testtt onnection..');
            res.end();
    }
})
server.on('connection',(req,res)=>
{
    console.log('new connection');
    res.send('Test Response');
})

server.listen(3000);
console.log('listening port 3000...');

