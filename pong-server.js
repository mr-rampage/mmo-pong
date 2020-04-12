import * as asset from 'node-static';
import * as webSocket from 'ws';
import http from 'http';
import flatMap from 'callbag-flat-map';
import fromEvents from 'callbag-from-events';
import subscribe from 'callbag-subscribe';
import interval from 'callbag-interval';
import fromIter from 'callbag-from-iter';
import map from 'callbag-map';
import tap from 'callbag-tap';
import share from 'callbag-share';
import { getGameState, getInitialState } from './pong';

export function makePongServer(port) {
  return (startStaticServer() |> startWebSocketServer).listen(port);
}

function startStaticServer() {
  return http.createServer((request, response) => {
    request.addListener('end', serveStaticContent(request, response)).resume();
  });
}

function startWebSocketServer(server) {
  const wss = new webSocket.Server({ server });
  const onConnection = share(fromEvents(wss, 'connection'))
  onConnection
    |> flatMap(connection => fromEvents(connection, 'message'))
    |> subscribe(console.info);

  onConnection
    |> subscribe(ws =>
      ws.send(JSON.stringify({
        type: 'INITIALIZE',
        payload: getInitialState()
      }))
    );

  const tickRate = 33;
  const onTick = interval(tickRate);
  const broadcast = makeBroadcast(wss);
  onTick
    |> map(getGameState)
    |> map(payload => ({ type: 'TICK', payload }))
    |> map(message => JSON.stringify(message))
    |> subscribe(broadcast);

  return server;
}

function makeBroadcast(wss) {
  return payload => wss.clients.forEach(ws => ws.send(payload));
}

function serveStaticContent(request, response) {
  const fileServer = new asset.Server('./client/public');

  return () => fileServer.serve(request, response, (e, err) => {
    if (e && e.status === 404) {
      fileServer.serveFile('index.svg', 200, {}, request, response);
    }
  });
}
