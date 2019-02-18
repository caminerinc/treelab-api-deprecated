const Koa = require('koa');
const socketioJwt = require('socketio-jwt');
const envConfig = require('../config/config');

const DEFAULT_OFFLINE_DELAY_TIME = 2000; //断线延时 ms

class SocketIO {
  constructor(opt) {
    this.port = (opt && opt.port) || envConfig.socketIoPort;
    if (!this.port) throw new Error('socketIoPort is required');
    this.app = new Koa();
    this.server = require('http').createServer(this.app.callback());
    this.io = require('socket.io')(this.server);
    this.server.listen(this.port);
    this.offlineDelayTime =
      envConfig.offlineDelayTime || DEFAULT_OFFLINE_DELAY_TIME;
    console.log(`socketIo is listening at port ${this.port}`);
    this.app.on('error', err => {
      console.error('socketIo error', err);
    });
    // this.io.use(
    //   socketioJwt.authorize({
    //     secret: envConfig.sharedSecret,
    //     handshake: true,
    //   }),
    // );
    this.onlineUsers = {};
    console.log("Listening for new connections");
    this.io.on('connection', socket => {
      console.log("New connection");
      if (this.onlineUsers[socket.id]) {
        this.onlineUsers[socket.id].socket = socket;
        this.onlineUsers[socket.id].connectTime = Date.now();
      } else {
        console.log(`user(${socket.id}) connected`);
        this.onlineUsers[socket.id] = {
          userId: socket.id,
          socket,
          connectTime: Date.now(),
        };
      }
      socket.on('disconnect', () => {
        console.log("Client disconnected");
        setTimeout(() => {
          const user = this.onlineUsers[socket.id];
          if (!user) return;
          const connectTime = user.connectTime;
          if (Date.now() - connectTime < this.offlineDelayTime) return;
          delete this.onlineUsers[socket.id];
          console.log(`user(${socket.id}) disconnected`);
        }, this.offlineDelayTime);
      });
    });
  }

  sync({ op, body }) {
    this.io.emit('sync', { op, body });
  }
}

module.exports = new SocketIO();
