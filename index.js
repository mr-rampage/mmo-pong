import NodeServer from './node-server';

const server = new NodeServer(process.env.PORT || 5000);
server.start();