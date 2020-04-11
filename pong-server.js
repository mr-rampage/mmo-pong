import * as asset from 'node-static';
import * as webSocket from 'ws';
import http from 'http';
import flatMap from 'callbag-flat-map';
import fromEvents from 'callbag-from-events';
import subscribe from 'callbag-subscribe';

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

  fromEvents(wss, 'connection')
    |> flatMap(connection => fromEvents(connection, 'message'))
    |> subscribe(console.info);

  return server;
}

function serveStaticContent(request, response) {
  const fileServer = new asset.Server('./client/public');

  return () => fileServer.serve(request, response, (e, err) => {
    if (e && e.status === 404) {
      fileServer.serveFile('index.svg', 200, {}, request, response);
    }
  });
}
