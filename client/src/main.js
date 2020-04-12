import websocket from 'callbag-websocket';
import observe from 'callbag-observe';
import map from 'callbag-map';
import pipe from 'callbag-pipe';
import tap from 'callbag-tap';
import share from 'callbag-share';
import take from 'callbag-take';
import filter from 'callbag-filter';
import {controllerSource} from './controller';
import {init, updateGameState} from './renderer';

const hostname = document.location.hostname;
const protocol = hostname === 'localhost' || document.location.protocol === 'http:' ? 'ws' : 'wss';
const port = hostname === 'localhost' ? ':5000' : '';
const url = `${protocol}://${hostname}${port}`;
console.log(url);

document.title = 'World of Pong';

const wss = websocket(url);
const onMessage = pipe(wss, map(message => JSON.parse(message.data)), share);

pipe(
    onMessage,
    filter(message => message.type === 'TICK'),
    // tap(data => console.log('Receiving:', data)),
    map(data => data.payload),
    observe(updateGameState)
);

pipe(
    onMessage,
    filter(message => message.type === 'INITIALIZE'),
    take(1),
    map(data => data.payload),
    observe(init)
)

pipe(
    controllerSource(),
    map(direction => ({ type: 'DIRECTION', data: direction })),
    map(data => JSON.stringify(data)),
    // tap(message => console.log('Sending:', message)),
    observe(send)
);

function send(message) {
    wss(1, message);
}