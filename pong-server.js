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
import { updateState } from './pong';

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
  const broadcast = makeBroadcast(wss);

  fromEvents(wss, 'connection')
    |> flatMap(connection => fromEvents(connection, 'message'))
    |> subscribe(console.info);

  interval(33)
    |> map(updateState)
    |> map(data => JSON.stringify(data))
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
