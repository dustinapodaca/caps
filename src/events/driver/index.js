'use strict';

// const eventPool = require('../../../EventEmitter');

require('dotenv').config();
const { io } = require('socket.io-client');
const socket = io(`http://localhost:3001/caps`);
// const PORT = process.env.PORT || 3002;

socket.on('pickup', pickedUp);

function pickedUp(payload, messageID) {
  socket.emit('getAll', {
    store: payload.payload.store,
    event: 'pickup',
  });
  setTimeout(() => {
    console.log('DRIVER: picked up', payload.payload.orderID);
    // eventPool.emit('IN-TRANSIT', payload);
    socket.emit('in-transit', payload);
  }, 2000);

  setTimeout(() => {
    console.log('DRIVER: delivered', payload.payload.orderID);
    // eventPool.emit('DELIVERED', payload);
    socket.emit('delivered', payload);
  }, 3500);

  setTimeout(() => {
    console.log('DRIVER: received', payload.payload.orderID);
    setTimeout(() => {
      socket.emit('received', {
        store: payload.payload.store,
        messageID: messageID,
        event: payload.event,
      });
    }, 5000);
  }, 1000);
}

module.exports = pickedUp;
