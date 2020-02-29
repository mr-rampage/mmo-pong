import websocket from 'callbag-websocket';
import observe from 'callbag-observe';
import { controllerSource } from './controller';

//const ws = websocket('ws://' + location.hostname + '/');

//observe(msg => console.log('obs1', msg.data))(ws);

const direction = controllerSource();
observe(msg => console.log(msg))(direction);

const gameState = {
    player1: {
        x: 0,
        y: 0.5,
        l: 0.1
    },
    player2: {
        x: 1,
        y: 0.5,
        l: 0.1
    },
    ball: {
        x: 0.5,
        y: 0.5,
        r: 0.01
    }
};