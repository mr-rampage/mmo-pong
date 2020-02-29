import SocketServer from './socket-server';
import HttpServer from './http-server';

const httpServer = new HttpServer(process.env.PORT || 5000);
const server = httpServer.start();

const socketServer = new SocketServer(server);
socketServer.start();