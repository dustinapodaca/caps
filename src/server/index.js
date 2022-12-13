'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const cors = require('cors');
// const PORT = process.env.PORT || 3002;
// require('../events/vendor');
// require('../events/driver');

const io = new Server(3001);

io.use(cors());

//create a namespace for the caps
const caps = io.of('/caps');

const logger = (event, payload) => {
  let log = {
    event: event,
    time: new Date(),
    payload: payload,
  };
  console.log('EVENT:', log);
};

caps.on('connection', (socket) => {
  console.log('Connected', socket.id);

  socket.on('join', (room) => {
    console.log('Joined', room);
    socket.join(room);
  });

  socket.on('pickup', (payload) => {
    logger('pickup', payload);
    socket.broadcast.emit('pickup', payload);
  });

  socket.on('in-transit', (payload) => {
    logger('in-transit', payload);
    socket.broadcast.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    logger('delivered', payload);
    socket.broadcast.emit('delivered', payload);
  });
});

