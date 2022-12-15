'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const cors = require('cors');
const Queue = require('./modules/queue');
const Chance = require('chance');
const chance = new Chance();
// const { messageID } = require('./lib/modules/messageID');

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
  return log;
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
    let pickUpLog = logger('pickup', payload.payload);
    let messageID = chance.fbid();
    driverQueue.enqueue(messageID, pickUpLog);
    console.log('driverQueue', driverQueue);
    // socket.to(payload.store).emit('pickup', payload);
    // socket.broadcast.emit('pickup', payload);
    socket.to(payload.store).emit('pickup', pickUpLog, messageID);
    socket.broadcast.emit('pickup', pickUpLog, messageID);
  });

  socket.on('in-transit', (payload) => {
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
    let inTransitLog = logger('in-transit', payload.payload);
    let messageID = chance.fbid();
    vendorQueue.enqueue(messageID, inTransitLog);
    console.log('vendorQueue', vendorQueue);
    socket.to(payload.store).emit('in-transit', inTransitLog, messageID);
    socket.broadcast.emit('in-transit', inTransitLog, messageID);
  });

  socket.on('delivered', (payload) => {
    let storeQueue = messageQueue.read(payload.payload.store);
    let vendorQueue = storeQueue.read('vendorQueue');
    let deliveredLog = logger('delivered', payload.payload);
    let messageID = chance.fbid();
    vendorQueue.enqueue(messageID, deliveredLog);
    console.log('vendorQueue', vendorQueue);
    console.log('storeQueue', storeQueue);
    console.log('messageQueue', messageQueue);
    console.log('messageQueue.readAll', messageQueue.readAll());
    console.log(JSON.stringify(messageQueue));

    socket.to(payload.store).emit('delivered', deliveredLog, messageID);
    socket.broadcast.emit('delivered', deliveredLog, messageID);
  });

  socket.on('received', (payload) => {
    setTimeout(() => {
      let storeQueue = messageQueue.read(payload.store);
      let currentQueue;
      if (payload.event === 'pickup') {
        currentQueue = storeQueue.read('driverQueue');
      } else if (payload.event === 'delivered' || payload.event === 'in-transit') {
        currentQueue = storeQueue.read('vendorQueue');
      } else {
        throw new Error('No Queue Found');
      }
      let messageToRemove = currentQueue.delete(payload.messageID);

      console.log('messageToRemove', messageToRemove);
      console.log('currentQueue', currentQueue);
      console.log('messageQueue', messageQueue);
      console.log('messageQueue.readAll', messageQueue.readAll());
      socket.to(payload.store).emit('received', messageToRemove);
    }, 9000);
  });

  socket.on('getAll', (payload) => {
    setTimeout(() => {
      let storeQueue = messageQueue.read(payload.store);
      let currentQueue;
      if (payload.event === 'pickup') {
        currentQueue = storeQueue.read('driverQueue');
      } else if (payload.event === 'delivered' || payload.event === 'in-transit') {
        currentQueue = storeQueue.read('vendorQueue');
      } else {
        throw new Error('No Queue Found');
      }
      let allMessages = currentQueue.readAll();
      console.log('allMessages', allMessages);
      socket.to(payload.store).emit('getAll', allMessages);
    }, 7000);
  });
});

// module.exports = {
//   server: io,
//   start: (PORT) => {
//     io.listen(PORT);
//   },
// };
