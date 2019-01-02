const Koa = require('koa');
const config = require('../../config/config');
const socketioJwt = require('socketio-jwt');

class SocketIO {
  constructor() {
    if (!config.socketIoPort) throw new Error('socketIoPort is required');
    this.app = new Koa();
    this.server = require('http').createServer(this.app.callback());
    this.io = require('socket.io')(this.server);
    this.server.listen(config.socketIoPort);
    console.log(`socketIo is listening at port ${config.socketIoPort}`);
    this.app.on('error', err => {
      console.error('socketIo error', err);
    });
    this.io.use(
      socketioJwt.authorize({
        secret: process.env.SHARED_SECRET,
        handshake: true,
      }),
    );
    this.io.on('connection', function(socket) {
      console.log(`${socket.decoded_token.userId} connected`);
    });
  }

  sync({ op, body }) {
    this.io.emit('sync', { op, body });
  }
}

module.exports = new SocketIO();
