'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const cors = require('cors');
const Queue = require('./lib/queue');

// const PORT = process.env.PORT || 3002;
// require('../events/vendor');
// require('../events/driver');

const io = new Server(3001);

io.use(cors());

//create a namespace for the caps
const caps = io.of('/caps');

const logger = (event, messageID, payload) => {
  let log = {
    event: event,
    time: new Date(),
    messageID: messageID,
    payload: payload,
  };
  console.log('EVENT:', log);
};

const messageQueue = new Queue();

caps.on('connection', (socket) => {
  console.log('Connected to Socket Server:', socket.id);
  // socket.onAny((event, payload) => logger(event, payload));

  socket.on('join', (storeRoom) => {
    console.log('Joined Room:', storeRoom);
    socket.join(storeRoom);
    socket.emit('join', storeRoom);
  });

  socket.on('pickup', (payload) => {
    let storeQueue = messageQueue.read(payload.payload.store);
    if (!storeQueue) {
      storeQueue = new Queue();
      messageQueue.enqueue(payload.payload.store, storeQueue);
    }
    let driverQueue = storeQueue.read(payload.payload.store);
    if (!driverQueue) {
      driverQueue = new Queue();
      storeQueue.enqueue('driverQueue', driverQueue);
    }
    driverQueue.enqueue(payload.messageID, payload.payload);
    console.log('storeQueue', storeQueue);
    console.log('driverQueue', driverQueue);
    socket.to(payload.store).emit('pickup', payload);

    logger('pickup', payload.messageID, payload.payload);
    socket.broadcast.emit('pickup', payload);

    console.log('messageQueue', messageQueue);
    console.log(JSON.stringify(messageQueue));
    console.log('messageQueue.readAll', messageQueue.readAll());
  });

  socket.on('in-transit', (payload) => {
    logger('in-transit', payload.messageID, payload.payload);
    socket.broadcast.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    let storeQueue = messageQueue.read(payload.payload.store);
    if (!storeQueue) {
      storeQueue = new Queue();
      messageQueue.enqueue(payload.payload.store, storeQueue);
    }
    let vendorQueue = storeQueue.read(payload.payload.store);
    if (!vendorQueue) {
      vendorQueue = new Queue();
      storeQueue.enqueue('vendorQueue', vendorQueue);
    }

    vendorQueue.enqueue(payload.messageID, payload.payload);
    console.log('storeQueue', storeQueue);
    console.log('vendorQueue', vendorQueue);
    socket.to(payload.roomId).emit('delivered', payload);

    logger('delivered', payload.messageID, payload.payload);
    socket.broadcast.emit('delivered', payload);

    console.log('messageQueue', messageQueue);
    console.log('messageQueue.readAll', messageQueue.readAll());
    console.log(JSON.stringify(messageQueue));

    // socket.broadcast.emit('getAll', payload.roomId);
  });

  // socket.on('received', (payload) => {
  //   setTimeout(() => {
  //     let currentQueue = messageQueue.read(payload.payload.store);
  //     if (!currentQueue) {
  //       throw new Error('No Queue Found');
  //     }
  //     let messageToRemove = currentQueue.delete(payload.messageID);

  //     console.log('messageToRemove', messageToRemove);
  //     console.log('currentQueue', currentQueue);
  //     console.log('messageQueue', messageQueue);
  //     console.log('messageQueue.readAll', messageQueue.readAll());
  //     socket.to(payload.payload.store).emit('received', messageToRemove);
  //   }, 5000);
  // });

  // socket.on('getAll', (payload) => {
  //   let currentQueue = messageQueue.read(payload.store);
  //   let currentVendorQueue = currentQueue.read()
  //   if (!currentQueue) {
  //     throw new Error('No Queue Found');
  //   }
  //   let allMessages = currentQueue.readAll();
  //   console.log('allMessages', allMessages);
  //   socket.to(payload).emit('getAll', allMessages);
  // });
});
