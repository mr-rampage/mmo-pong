import fs from 'fs';
import http from 'http';

export default class HttpServer {
  constructor(port) {
    this.port = port;
  }

  start() {
    const server = http.createServer((req, res) => {
      fs.readFile(__dirname + '/index.html', (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    });
    
    server.listen(this.port);

    console.log(`HTTP Server started on ${this.port}`);

    return server;
  }
}

