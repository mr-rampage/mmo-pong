import fs from 'fs';
import http from 'http';
import WebSocket from "ws";

export default class NodeServer {
  constructor(port) {
    this.port = port;
  }

  start() {
    const server = http.createServer((req, res) => {
      fs.readFile(__dirname + '/client/public/index.html', (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    }).listen(this.port);

    const wss = new WebSocket.Server({server});

    wss.on('connection', (socket) => {
      socket.on('message', (payload) => {
        let message;
        try {
          message = JSON.parse(payload);
        } catch (e) {
          console.error('Unable to parse message payload', e);
        }

        switch (message.type) {
          case 'PING': socket.send('PONG'); break;
          default:
            console.log('received: %s', message);
            break;
        }
      });
    });

    console.log(`Server started on ${this.port}`);
  }
}

