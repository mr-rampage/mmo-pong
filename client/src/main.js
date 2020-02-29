import websocket from 'callbag-websocket';
import observe from 'callbag-observe';
import { pipe, map, fromEvent } from 'callbag-basics';
import { controllerSource } from './controller';
import init, { render } from './renderer';

const hostname = document.location.hostname;
const protocol = hostname === 'localhost' || document.location.protocol === 'http:' ? 'ws' : 'wss';
const port = hostname === 'localhost' ? ':5000' : '';
const url = `${protocol}://${hostname}${port}`;

const ws = websocket(url);

const gameState = pipe(
    ws,
    map(msg => JSON.parse(msg.data))
);

observe(draw)(gameState);

const direction = pipe(
    controllerSource(),
    map(direction => ({ type: 'DIRECTION', data: direction }))
);

observe(send)(direction);

function send(msg) {
    console.info("Sending to socket server:", msg);
    ws(1, JSON.stringify(msg));
}

function draw(msg) {
    console.info("Received game state:", msg);
    render(msg);
}

function adaptGameState(msg) {
    return {
        p1: {
            x: msg.p1[0],
            y: msg.p1[1],
        },
        p2: {
            x: msg.p2[0],
            y: msg.p2[1],
        },
        ball: {
            x: msg.ball[0],
            y: msg.ball[1]
        }
    };
}

init();