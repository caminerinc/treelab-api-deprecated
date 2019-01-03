const Koa = require('koa');
const config = require('../../config/config');
const socketioJwt = require('socketio-jwt');

const DEFAULT_OFFLINE_DELAY_TIME = 1000; //断线延时 ms

class SocketIO {
  constructor(opt) {
    this.port = (opt && opt.port) || config.socketIoPort;
    if (!this.port) throw new Error('socketIoPort is required');
    this.app = new Koa();
    this.server = require('http').createServer(this.app.callback());
    this.io = require('socket.io')(this.server);
    this.server.listen(this.port);
    this.offlineDelayTime =
      config.offlineDelayTime || DEFAULT_OFFLINE_DELAY_TIME;
    console.log(`socketIo is listening at port ${this.port}`);
    this.app.on('error', err => {
      console.error('socketIo error', err);
    });
    this.io.use(
      socketioJwt.authorize({
        secret: process.env.SHARED_SECRET,
        handshake: true,
      }),
    );
    this.onlineUsers = {};
    this.io.on('connection', socket => {
      if (this.onlineUsers[socket.decoded_token.userId]) {
        this.onlineUsers[socket.decoded_token.userId].socket = socket;
        this.onlineUsers[socket.decoded_token.userId].connectTime = Date.now();
      } else {
        console.log(`user(${socket.decoded_token.userId}) connected`);
        this.onlineUsers[socket.decoded_token.userId] = {
          userId: socket.decoded_token.userId,
          socket,
          connectTime: Date.now(),
        };
      }
      socket.on('disconnect', () => {
        setTimeout(() => {
          const user = this.onlineUsers[socket.decoded_token.userId];
          if (!user) return;
          const connectTime = user.connectTime;
          if (Date.now() - connectTime < this.offlineDelayTime) return;
          delete this.onlineUsers[socket.decoded_token.userId];
          console.log(`user(${socket.decoded_token.userId}) disconnected`);
        }, this.offlineDelayTime);
      });
    });
  }

  sync({ op, body }) {
    this.io.emit('sync', { op, body });
  }
}

module.exports = new SocketIO();
