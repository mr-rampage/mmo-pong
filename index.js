import SocketServer from './socket-server';
import HttpServer from './http-server';

const httpServer = new HttpServer(process.env.PORT || 5000);
httpServer.start();

const socketServer = new SocketServer(5001);
socketServer.start();