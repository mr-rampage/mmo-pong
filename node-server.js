import express from 'express';
import httpsRedirect from 'express-http-to-https';

import {v4 as uuidv4} from 'uuid';
import WebSocket from "ws";
import Game from "./simulator";

export default class NodeServer {
  constructor(port) {
    this.port = port;

    this.wss = this.getSocketServer(this.getHttpServer());
    console.log(`Server started on ${this.port}`);

    // uuid -> socket
    this.leftPlayers = {};
    this.rightPlayers = {};
    this.game = new Game();

    // Game loop
    this.interval = setInterval(() => {
      let leftDecision = this.determineDirection(this.leftPlayers);
      let rightDecision = this.determineDirection(this.rightPlayers);
      console.log(`Decisions (${this.getTeamSize(this.leftPlayers)}, ${this.getTeamSize(this.rightPlayers)}): ${leftDecision}, ${rightDecision}`);
      this.wss.clients.forEach(socket => {
        let newGameState = this.game.simulate({leftDecision, rightDecision});
        socket.send(JSON.stringify(newGameState));
      });
    }, 300);
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
    return wss;
  }

  getHttpServer() {
    const app = express();
    // Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
    app.use(httpsRedirect.redirectToHTTPS([/localhost:(\d{4})/], [], 301));
    app.use('/', express.static(__dirname + '/client/public'));
    return app.listen(this.port);
  }

  assignPlayer(socket) {
    const team = (this.getTeamSize(this.leftPlayers) < this.getTeamSize(this.rightPlayers)) ? this.leftPlayers : this.rightPlayers;
    const playerId = uuidv4();
    socket.playerId = playerId;
    socket.direction = 0;
    team[playerId] = socket;
  }

  getTeamSize(players) {
    return Object.keys(players).length;
  }

  determineDirection(players) {
    let totalPlayers = this.getTeamSize(players);
    let direction = 0;
    if (totalPlayers > 0) {
      const directions = Object.values(players).map(p => p.direction || 0);
      let average = directions.reduce((acc, d) => acc += d, 0) / totalPlayers;

      if (average > 0) direction = 'DOWN';
      else if (average === 0) direction = 'STOP';
      else direction = 'UP';
    }

    return direction;
  }

}

