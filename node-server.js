import express from 'express';
import WebSocket from "ws";

export default class NodeServer {
  constructor(port) {
    this.port = port;
  }

  start() {
    this.getSocketServer(this.getHttpServer());
    console.log(`Server started on ${this.port}`);
  }

  getSocketServer(server) {
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
          case 'PING':
            socket.send('PONG');
            break;
          case 'DIRECTION':
            let direction = message.data;
            console.log('direction: :' + direction);
            socket.send(JSON.stringify({
              p1: [0, 0],
              p2: [1, 1],
              ball: [0, 0]
            }));
            break;
          default:
            console.log('received: %s', message);
            break;
        }
      });
    });
  }

  getHttpServer() {
    const app = express();
    app.use('/', express.static(__dirname + '/client/public'));
    return app.listen(this.port);
  }
}

