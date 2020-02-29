import websocket from 'callbag-websocket';
import observe from 'callbag-observe';

const ws = websocket('ws://' + location.hostname + '/');

observe(msg => console.log('obs1', msg.data))(ws);