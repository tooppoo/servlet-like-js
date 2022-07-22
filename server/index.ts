import * as  http from 'http'

const server = http.createServer((req, res) => {
    res.writeHead(
        200,
        {
            "Content-Type": "text/html",
        },
    )

    res.end('<h1>Hello world!</h1>')
})

server.listen(9090)