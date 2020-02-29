import express from 'express';
import {v4 as uuidv4} from 'uuid';
import WebSocket from "ws";

export default class NodeServer {
  constructor(port) {
    this.port = port;
    // uuid -> socket
    this.leftPlayers = {};
    this.rightPlayers = {};

    // Game loop
    this.interval = setInterval(() => {
      let leftDecision = this.determineDirection(this.leftPlayers);
      let rightDecision = this.determineDirection(this.rightPlayers);
      console.log(`Decisions (${Object.keys(this.leftPlayers).length}, ${Object.keys(this.rightPlayers).length}): ${leftDecision}, ${rightDecision}`);
      // TODO: Broadcast game state to clients
    }, 500);
  }

  start() {
    this.getSocketServer(this.getHttpServer());
    console.log(`Server started on ${this.port}`);
  }

  getSocketServer(server) {
    const wss = new WebSocket.Server({server});

    wss.on('connection', (socket) => {
      this.assignPlayer(socket);

      socket.on('close', () => {
        delete this.leftPlayers[socket.playerId];
        delete this.rightPlayers[socket.playerId];
      });

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
            socket.direction = direction;
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

  assignPlayer(socket) {
    const team = (this.leftPlayers.length < this.rightPlayers.length) ? this.leftPlayers : this.rightPlayers;
    const playerId = uuidv4();
    socket.playerId = playerId;
    socket.direction = 0;
    team[playerId] = socket;
  }

  determineDirection(players) {
    let totalPlayers = Object.keys(players).length;
    if (totalPlayers > 0) {
      const directions = Object.values(players).map(p => p.direction || 0);
      let average = directions.reduce((acc, d) => acc += d, 0) / totalPlayers;

      if (average > 0) return 1;
      else if (average === 0) return 0;
      else return -1;
    }

    return 0;
  }
}

