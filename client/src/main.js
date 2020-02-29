import websocket from 'callbag-websocket';
import observe from 'callbag-observe';
import { controllerSource, mouseSource } from './controller';
import init from './renderer';

//const ws = websocket('ws://' + location.hostname + '/');

//observe(msg => console.log('obs1', msg.data))(ws);

const direction = controllerSource();
observe(msg => console.log(msg))(direction);

init();