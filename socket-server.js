import WebSocket from 'ws';

export default class SocketServer {
  constructor(port) {
    this.port = port;
  }

  start() {
    this.wss = new WebSocket.Server({
      port: this.port
    }, () => console.log(`Websocket server listening on port ${this.port}`));

    this.wss.on('connection', (socket) => {
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
  }
}


