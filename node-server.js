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
    console.log('Initting game', this.game);

    // Game loop
    this.interval = setInterval(() => {
      let leftDecision = this.determineDirection(this.leftPlayers);
      let rightDecision = this.determineDirection(this.rightPlayers);
      let newGameState = {...this.game.simulate({leftDecision, rightDecision}), ...this.getAllPlayerStates()};

      this.wss.clients.forEach(socket => {
        socket.send(JSON.stringify(newGameState));
      });
    }, 200);
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
            socket.direction = message.data;
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
    this.leftPlayers[playerId] = socket;
  }

  getAllPlayerStates() {
    let getPlayerState = socket => {
      return {
        y: socket.direction,
        name: socket.playerId
      };
    };

    return {
      players: {
        left: Object.values(this.leftPlayers).map(getPlayerState),
        right: Object.values(this.rightPlayers).map(getPlayerState)
      }
    };
  }

  getTeamSize(players) {
    return Object.keys(players).length;
  }

  determineDirection(players) {
    let totalPlayers = this.getTeamSize(players);
    let direction = 'STOP';
    if (totalPlayers > 0) {
      const directions = Object.values(players).map(p => p.direction || 0);
      let average = directions.reduce((acc, d) => acc += d, 0) / totalPlayers;

      if (average > 0.1) direction = 'DOWN';
      else if (average >= -0.1 && average <= 0.1) direction = 'STOP';
      else direction = 'UP';
    }

    return direction;
  }

}

