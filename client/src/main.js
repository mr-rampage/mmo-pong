import websocket from 'callbag-websocket';
import observe from 'callbag-observe';
import map from 'callbag-map';
import pipe from 'callbag-pipe';
import tap from 'callbag-tap';
import {controllerSource} from './controller';
import init, {render} from './renderer';

const hostname = document.location.hostname;
const protocol = hostname === 'localhost' || document.location.protocol === 'http:' ? 'ws' : 'wss';
const port = hostname === 'localhost' ? ':5000' : '';
const url = `${protocol}://${hostname}${port}`;
console.log(url);

document.title = 'World of Pong';

const wss = websocket(url);

pipe(
    wss,
    map(message => JSON.parse(message.data)),
    tap(data => console.log('Receiving:', data)),
    observe(render)
);

pipe(
    controllerSource(),
    map(direction => ({ type: 'DIRECTION', data: direction })),
    map(data => JSON.stringify(data)),
    tap(message => console.log('Sending:', message)),
    observe(send)
);

function send(message) {
    wss(1, message);
}

init();